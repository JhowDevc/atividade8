package com.seuapp.userapi.controller;

import com.seuapp.userapi.dto.ForgotPasswordRequest;
import com.seuapp.userapi.dto.LoginRequest;
import com.seuapp.userapi.dto.RegisterRequest;
import com.seuapp.userapi.dto.ResetPasswordRequest;
import com.seuapp.userapi.dto.UserResponse;
import com.seuapp.userapi.entity.User;
import com.seuapp.userapi.repository.UserRepository;
import com.seuapp.userapi.service.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail; // Injeta o remetente do application.properties

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        logger.info("Login attempt with email: {}", loginRequest.getEmail());

        if (loginRequest.getEmail() == null || loginRequest.getEmail().isEmpty() ||
                loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty()) {
            logger.warn("Email or password is empty");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email e senha são obrigatórios");
        }

        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        if (userOptional.isEmpty()) {
            logger.warn("User not found for email: {}", loginRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha inválidos");
        }

        User user = userOptional.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            logger.warn("Invalid password for email: {}", loginRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha inválidos");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getName());
        logger.info("Login successful for email: {}", loginRequest.getEmail());
        return ResponseEntity.ok(token);
    }

    @GetMapping("/success")
    public void loginSuccess(Authentication authentication, HttpServletResponse response) throws IOException {
        logger.info("Entering /auth/success");
        logger.info("Authentication object: {}", authentication);

        if (authentication == null || !authentication.isAuthenticated()) {
            logger.error("No authenticated user found in /auth/success");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Nenhum usuário autenticado encontrado. Faça login primeiro.");
            return;
        }

        Object principal = authentication.getPrincipal();
        logger.info("Principal object: {}", principal);

        String email;
        String name;

        if (principal instanceof OidcUser oidcUser) {
            logger.info("OidcUser object: {}", oidcUser);
            email = oidcUser.getEmail();
            name = oidcUser.getFullName() != null ? oidcUser.getFullName() : oidcUser.getGivenName();
        } else {
            logger.warn("Principal is not an OidcUser: {}", principal.getClass());
            email = authentication.getName();
            name = email; // Usa o email como nome se não houver outro dado
        }

        if (email == null) {
            logger.error("No email found in authentication principal");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Erro: Email não encontrado.");
            return;
        }

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        if (userOptional.isEmpty()) {
            user = new User();
            user.setEmail(email);
            user.setName(name != null ? name : "Usuário OAuth2");
            user.setPassword(passwordEncoder.encode("oauth2-placeholder"));
            user = userRepository.save(user);
            logger.info("New OAuth2 user registered: {}", email);
        } else {
            user = userOptional.get();
            // Atualiza o nome se estiver vazio ou nulo no banco
            if (user.getName() == null || user.getName().isEmpty()) {
                user.setName(name != null ? name : "Usuário OAuth2");
                userRepository.save(user);
                logger.info("Updated user name for: {}", email);
            }
            logger.info("User already exists: {}", email);
        }

        String jwtToken = jwtService.generateToken(email, user.getName());
        logger.info("Generated JWT token for user: {}", email);

        String redirectUrl = "http://localhost:5173/?token=" + jwtToken;
        logger.info("Redirecting to: {}", redirectUrl);
        response.sendRedirect(redirectUrl);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
        logger.info("Register attempt with email: {}", registerRequest.getEmail());

        if (registerRequest.getEmail() == null || registerRequest.getEmail().isEmpty() ||
                registerRequest.getPassword() == null || registerRequest.getPassword().isEmpty() ||
                registerRequest.getName() == null || registerRequest.getName().isEmpty()) {
            logger.warn("Missing required fields for registration");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nome, email e senha são obrigatórios");
        }

        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            logger.warn("E-mail already registered: {}", registerRequest.getEmail());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("E-mail já cadastrado");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        userRepository.save(user);

        logger.info("User registered successfully: {}", registerRequest.getEmail());

        String token = jwtService.generateToken(registerRequest.getEmail(), registerRequest.getName());
        return ResponseEntity.ok(token);
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkAuth(Authentication authentication) {
        logger.info("Checking authentication status: {}", authentication);
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                logger.info("User authenticated: {}", email);
                return ResponseEntity.ok(new UserResponse(user.getName()));
            }
        }
        logger.warn("No authenticated user found");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Não autenticado");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        logger.info("Forgot password request for email: {}", request.getEmail());
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isEmpty()) {
            logger.warn("User not found for email: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
        }

        User user = userOptional.get();
        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        userRepository.save(user);
        logger.info("Reset token generated: {} for email: {}", resetToken, user.getEmail());

        try {
            String resetUrl = "http://localhost:5173/reset-password?token=" + resetToken;
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Redefinição de Senha");
            message.setText("Clique no link para redefinir sua senha: " + resetUrl);
            message.setFrom(fromEmail); // Define o remetente usando o valor injetado

            // Cast para JavaMailSenderImpl para acessar os métodos de configuração
            if (mailSender instanceof JavaMailSenderImpl senderImpl) {
                logger.info("Mail host: {}", senderImpl.getHost());
                logger.info("Mail port: {}", senderImpl.getPort());
                logger.info("Mail username: {}", senderImpl.getUsername());
            } else {
                logger.warn("mailSender is not an instance of JavaMailSenderImpl: {}", mailSender.getClass());
            }

            logger.info("Preparing to send email to: {} from: {}", user.getEmail(), fromEmail);
            mailSender.send(message);
            logger.info("Email sent successfully to: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send reset email to {}: {}", user.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao enviar e-mail de redefinição");
        }

        return ResponseEntity.ok("Um e-mail com instruções foi enviado.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        logger.info("Reset password attempt with token: {}", request.getToken());
        Optional<User> userOptional = userRepository.findByResetToken(request.getToken());
        if (userOptional.isEmpty()) {
            logger.warn("Invalid or expired reset token: {}", request.getToken());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token inválido ou expirado");
        }

        User user = userOptional.get();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null); // Limpa o token após uso
        userRepository.save(user);

        logger.info("Password reset successful for email: {}", user.getEmail());
        return ResponseEntity.ok("Senha redefinida com sucesso");
    }
}