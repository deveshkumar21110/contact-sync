package site.devesh.contactsync.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import site.devesh.contactsync.entities.UserInfo;

@Repository
public interface UserRepo extends JpaRepository<UserInfo, Long> {

    public UserInfo findByUsername(String username);
}
