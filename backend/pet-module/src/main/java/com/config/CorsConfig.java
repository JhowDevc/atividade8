package com;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Aplica a todos os endpoints
                        .allowedOrigins("http://localhost:3000", "http://localhost:5173") // Origens permitidas
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos permitidos
                        .allowedHeaders("*") // Todos os headers permitidos
                        .allowCredentials(true); // Permite cookies, se necessário
            }
        };
    }
}