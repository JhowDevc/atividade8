package com.seuapp.userapi.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String text) {
        try {
            logger.info("Enviando e-mail para: {} com remetente: {}", to, fromEmail);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            message.setFrom(fromEmail);
            mailSender.send(message);
            logger.info("E-mail enviado com sucesso para: {}", to);
        } catch (Exception e) {
            logger.error("Erro ao enviar e-mail para {}: {}", to, e.getMessage(), e);
            throw e;
        }
    }
}