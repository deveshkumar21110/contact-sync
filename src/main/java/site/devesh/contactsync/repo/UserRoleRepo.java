package site.devesh.contactsync.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import site.devesh.contactsync.entities.UserRole;

@Repository
public interface UserRoleRepo extends JpaRepository<UserRole,Long> {
    public UserRole findByName(String role);
}
