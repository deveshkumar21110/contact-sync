package site.devesh.contactsync.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import site.devesh.contactsync.entities.UserRole;
import site.devesh.contactsync.enums.RoleType;

import java.util.Optional;

@Repository
public interface UserRoleRepo extends JpaRepository<UserRole,Long> {
    public Optional<UserRole> findByName(RoleType role);
}
