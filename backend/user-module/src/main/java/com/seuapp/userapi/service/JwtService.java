package com.seuapp.userapi.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    private Key getSigningKey() {
        logger.info("Gerando chave de assinatura com secret: {}", secret);
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String email, String name) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("name", name);
        String token = Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
        logger.info("Token gerado para email {}: {}", email, token);
        return token;
    }

    public String generateToken(String email) {
        String token = Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
        logger.info("Token gerado para email {}: {}", email, token);
        return token;
    }

    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        String email = claims.getSubject();
        logger.debug("Email extraído do token {}: {}", token, email);
        return email;
    }

    public String getNameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        String name = (String) claims.get("name");
        logger.debug("Nome extraído do token {}: {}", token, name);
        return name;
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            logger.debug("Token validado com sucesso: {}", token);
            return true;
        } catch (Exception e) {
            logger.error("Erro ao validar token {}: {}", token, e.getMessage());
            return false;
        }
    }
}