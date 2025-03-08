package com.seuapp.userapi.service;

import com.seuapp.userapi.entity.User;
import com.seuapp.userapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public void sendPasswordResetEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        userRepository.save(user);

        String resetLink = "http://localhost:8080/users/password/reset?token=" + token;
        emailService.sendEmail(email, "Recuperação de Senha",
                "Clique aqui para redefinir sua senha: " + resetLink);
    }
}