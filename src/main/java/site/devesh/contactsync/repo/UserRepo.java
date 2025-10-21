package site.devesh.contactsync.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import site.devesh.contactsync.entities.AppUser;

@Repository
public interface UserRepo extends JpaRepository<AppUser, String> {

    @Query("SELECT u FROM AppUser u JOIN FETCH u.roles r WHERE u.username = :username")
    AppUser findByUsername(@Param("username") String username);

    @Query("SELECT u FROM AppUser u JOIN FETCH u.roles r WHERE u.email = :email")
    AppUser findByEmail(@Param("email") String email);

}
