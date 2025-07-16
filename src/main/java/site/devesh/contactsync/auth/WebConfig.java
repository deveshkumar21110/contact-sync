package site.devesh.contactsync.auth;

import jakarta.annotation.PostConstruct;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${cors.allowed.origins}")
    private String corsAllowedOrigins;

    @PostConstruct
    public void printCorsOrigins() {
        System.out.println("✅ Allowed CORS origins: " + corsAllowedOrigins);
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        String[] allowedOriginsArray = Arrays.stream(corsAllowedOrigins.split(","))
                .map(String::trim)
                .toArray(String[]::new);

        registry.addMapping("/**")
                .allowedOrigins(allowedOriginsArray)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .exposedHeaders("Authorization")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
