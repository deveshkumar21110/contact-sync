package site.devesh.contactsync.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import site.devesh.contactsync.entities.AppUser;
import site.devesh.contactsync.entities.Label;

public interface LabelRepo extends JpaRepository<Label,String> {

    Label findByName(String name);
    List<Label> findByAppUser(AppUser user);
    boolean existsByName(String name);

    Label findByNameAndAppUser(String name, AppUser appUser);
    
}
