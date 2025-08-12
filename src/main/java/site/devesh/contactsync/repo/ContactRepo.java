package site.devesh.contactsync.repo;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import site.devesh.contactsync.entities.AppUser;
import site.devesh.contactsync.entities.Contact;
import site.devesh.contactsync.model.ContactPreviewDTO;

import java.util.List;

@Repository
public interface ContactRepo extends JpaRepository<Contact, String> {

    Contact getContactById(String id);

    // Repository methods - one collection per query
    @EntityGraph(attributePaths = {"phoneNumbers"})
    @Query("SELECT c FROM Contact c WHERE c.user.id = :userId")
    List<Contact> findContactsWithPhones(@Param("userId") String userId);

    @EntityGraph(attributePaths = {"emails"})
    @Query("SELECT c FROM Contact c WHERE c.user.id = :userId")
    List<Contact> findContactsWithEmails(@Param("userId") String userId);

    @EntityGraph(attributePaths = {"addresses"})
    @Query("SELECT c FROM Contact c WHERE c.user.id = :userId")
    List<Contact> findContactsWithAddresses(@Param("userId") String userId);

    @EntityGraph(attributePaths = {"labels"})
    @Query("SELECT c FROM Contact c WHERE c.user.id = :userId")
    List<Contact> findContactsWithLabels(@Param("userId") String userId);

    @Query("SELECT COUNT(c) FROM Contact c WHERE c.user.id = :userId")
    Long countContactsByUserId(@Param("userId") String userId);

    @Query("SELECT c FROM Contact c WHERE c.user.id = :userId")
    List<Contact> findContactsByUserId(@Param("userId") String userId);

    // For full contact details - fetch everything
    @Query("SELECT DISTINCT c FROM Contact c " +
           "LEFT JOIN FETCH c.phoneNumbers " +
           "LEFT JOIN FETCH c.emails " +
           "LEFT JOIN FETCH c.addresses " +
           "LEFT JOIN FETCH c.websites " +
           "LEFT JOIN FETCH c.significantDates " +
           "LEFT JOIN FETCH c.labels " +
           "WHERE c.user = :user")
    List<Contact> findContactsWithAllData(@Param("user") AppUser user);
}
