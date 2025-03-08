package com.seuapp.userapi.config;

import com.seuapp.userapi.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        logger.debug("Requisição recebida com Authorization: {}", authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.debug("Nenhum token Bearer encontrado, prosseguindo sem autenticação");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        logger.info("Processando token JWT: {}", token);

        try {
            String email = jwtService.getEmailFromToken(token);
            logger.debug("Email extraído do token: {}", email);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                if (jwtService.validateToken(token)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(email, null, null);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.info("Autenticação bem-sucedida para email: {}", email);
                } else {
                    logger.warn("Token inválido: {}", token);
                }
            }
        } catch (Exception e) {
            logger.error("Erro ao processar token JWT: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}