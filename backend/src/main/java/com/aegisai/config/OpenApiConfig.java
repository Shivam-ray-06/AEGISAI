package com.aegisai.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI aegisAiOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("AEGISAI :: Emergency Response Intelligence API")
                        .description("Artificial Emergency Guidance & Intelligent Surveillance using AI - Application Backend")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("AEGISAI Engineering Team")
                                .email("contact@aegisai.internal")));
    }
}
