package site.devesh.contactsync.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import site.devesh.contactsync.entities.AppUser;
import site.devesh.contactsync.entities.Contact;

import java.util.List;

@Repository
public interface ContactRepo extends JpaRepository<Contact,String> {

    List<Contact> findContactByUser(AppUser user);
}
