package site.devesh.contactsync.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import site.devesh.contactsync.entities.UserInfo;

@Repository
public interface UserRepo extends JpaRepository<UserInfo, Long> {

    @Query("SELECT u FROM UserInfo u JOIN FETCH u.roles r WHERE u.username = :username")
    UserInfo findByUsername(@Param("username") String username);


}
