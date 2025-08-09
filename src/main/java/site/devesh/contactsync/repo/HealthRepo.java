package site.devesh.contactsync.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import site.devesh.contactsync.entities.Health;

public interface HealthRepo extends JpaRepository<Health, String> {
}
