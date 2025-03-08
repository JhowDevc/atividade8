import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import session from 'express-session';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = express();

// Configura o CORS para permitir requisições do front-end
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Configuração do express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'yQDnESTcgkVsHPYbpihUxeBlJrdtRMLN',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, // Em produção, use true com HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  })
);

// Inicializa o Passport e as sessões
app.use(passport.initialize());
app.use(passport.session());

const JWT_SECRET = process.env.JWT_SECRET || 'yQDnESTcgkVsHPYbpihUxeBlJrdtRMLN';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Configurar Passport JWT
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { id: payload.id } });
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Configurar Passport Google OAuth2
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({ where: { googleId: profile.id } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              age: 25, // Valor padrão
            },
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Serializar e deserializar usuário (necessário para sessões)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Middleware de autenticação (sessão ou token JWT)
const authenticateToken = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    req.user = req.user || req.session.passport?.user;
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token)
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
};

// Rota protegida de exemplo (/home)
app.get('/home', authenticateToken, (req, res) => {
  if (req.user) {
    res.send(`<h1>Bem-vindo à Home, ${req.user.name || 'Usuário'}!</h1>
      <p>Você está logado.</p>
      <p><a href="/logout">Sair</a></p>`);
  } else {
    res.status(401).send('<h1>Erro: Usuário não autenticado.</h1>');
  }
});

// Rotas para configuração e verificação de 2FA (mantém seu funcionamento atual)
app.get('/2fa/setup', authenticateToken, async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `BuscaPet:${req.user.email}`,
    });

    await prisma.user.update({
      where: { id: req.user.id },
      data: { twoFASecret: secret.base32 },
    });

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
    res.json({ qrCodeUrl, secret: secret.base32 });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao configurar 2FA.' });
  }
});

app.post('/2fa/verify', authenticateToken, async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Código 2FA é obrigatório.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const isValid = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: 'base32',
      token,
    });

    if (isValid) {
      res.status(200).json({ message: '2FA verificado com sucesso.' });
    } else {
      res.status(401).json({ error: 'Código 2FA inválido.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar 2FA.' });
  }
});

// Rotas para criação, atualização, deleção e listagem de usuários (mantendo seu funcionamento)
app.post('/usuarios', authenticateToken, async (req, res) => {
  const { email, name, age, password } = req.body;

  if (!email || typeof email !== 'string' || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ error: 'Email é obrigatório e deve ser válido.' });
  }
  if (!name || typeof name !== 'string' || name.length < 2) {
    return res.status(400).json({ error: 'Nome é obrigatório e deve ter pelo menos 2 caracteres.' });
  }
  if (typeof age !== 'number' || age < 1 || age > 120) {
    return res.status(400).json({ error: 'Idade é obrigatória e deve estar entre 1 e 120.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Senha é obrigatória e deve ter pelo menos 6 caracteres.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, name, age, password: hashedPassword },
    });
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(201).json({ message: 'Usuário criado com sucesso', user: { id: user.id, email, name, age }, token });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email já registrado.' });
    }
    res.status(500).json({ error: 'Erro interno ao criar usuário.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password, totpCode } = req.body;

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ error: 'Email é obrigatório e deve ser válido.' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Senha é obrigatória.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    const passwordMatch = user.password ? await bcrypt.compare(password, user.password) : false;
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    if (user.twoFASecret) {
      if (!totpCode) {
        return res.status(401).json({ message: '2FA necessário. Forneça o código TOTP.', userId: user.id });
      }

      const isValid = speakeasy.totp.verify({
        secret: user.twoFASecret,
        encoding: 'base32',
        token: totpCode,
      });

      if (!isValid) {
        return res.status(401).json({ error: 'Código TOTP inválido.' });
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'Login realizado com sucesso', user: { id: user.id, email, name: user.name, age: user.age }, token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro interno ao fazer login.' });
  }
});

app.put('/usuarios/:id', authenticateToken, async (req, res) => {
  const { email, name, age, password } = req.body;
  const { id } = req.params;

  if (req.user.id !== id) {
    return res.status(403).json({ error: 'Você só pode atualizar seu próprio perfil.' });
  }

  if (!email || typeof email !== 'string' || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ error: 'Email é obrigatório e deve ser válido.' });
  }
  if (!name || typeof name !== 'string' || name.length < 2) {
    return res.status(400).json({ error: 'Nome é obrigatório e deve ter pelo menos 2 caracteres.' });
  }
  if (typeof age !== 'number' || age < 1 || age > 120) {
    return res.status(400).json({ error: 'Idade é obrigatória e deve estar entre 1 e 120.' });
  }

  try {
    const updateData = { email, name, age };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: id },
      data: updateData,
    });
    res.status(200).json({ message: 'Usuário atualizado com sucesso', user: { id: user.id, email, name, age } });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email já registrado por outro usuário.' });
    }
    res.status(500).json({ error: 'Erro interno ao atualizar usuário.' });
  }
});

app.delete('/usuarios/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (req.user.id !== id) {
    return res.status(403).json({ error: 'Você só pode deletar seu próprio perfil.' });
  }

  try {
    await prisma.user.delete({ where: { id: id } });
    res.status(200).json({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro interno ao deletar usuário.' });
  }
});

app.get('/usuarios', authenticateToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, age: true },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno ao buscar usuários.' });
  }
});

// Rotas OAuth2 (apenas Google)
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Após a autenticação com o Google, gera um token e redireciona para o front-end
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, name: req.user.name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    // Redireciona para o front-end passando o token e o nome do usuário via query string
    res.redirect(`http://localhost:5173/?token=${token}&userName=${encodeURIComponent(req.user.name)}`);
  }
);

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Erro ao fazer logout:', err);
      return res.status(500).json({ error: 'Erro interno ao fazer logout.' });
    }
    res.redirect('/');
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
