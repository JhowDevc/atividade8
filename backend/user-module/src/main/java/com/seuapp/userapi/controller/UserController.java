package com.seuapp.userapi.controller;

import com.seuapp.userapi.dto.ResetPasswordRequest;
import com.seuapp.userapi.entity.User;
import com.seuapp.userapi.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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