package site.devesh.contactsync.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import site.devesh.contactsync.entities.Health;
import site.devesh.contactsync.repo.HealthRepo;

@RestController
@RequestMapping("/api")
public class HealthCheckController {

    private final HealthRepo healthRepository;
    private final HealthRepo healthRepo;

    public HealthCheckController(HealthRepo healthRepository, HealthRepo healthRepo) {
        this.healthRepository = healthRepository;
        this.healthRepo = healthRepo;
    }

    @GetMapping("/health")
    public ResponseEntity<?> getHealthCheck() {
        Health health = healthRepository.findById("h1c").orElseGet(() -> {
            Health defaultHealth = new Health("h1c","UP", "Service is running");
            return healthRepo.save(defaultHealth);
        });
        return ResponseEntity.ok(health);
    }
}
