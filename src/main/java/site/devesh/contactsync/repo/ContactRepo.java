package site.devesh.contactsync.repo;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import site.devesh.contactsync.entities.AppUser;
import site.devesh.contactsync.entities.Contact;
import site.devesh.contactsync.model.ContactPreviewDTO;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactRepo extends JpaRepository<Contact, String> {

    Contact getContactById(String id);

    // Repository methods - one collection per query
    @EntityGraph(attributePaths = { "phoneNumbers" })
    @Query("SELECT c FROM Contact c WHERE c.user.id = :userId")
    List<Contact> findContactsWithPhones(@Param("userId") String userId);

    @EntityGraph(attributePaths = { "emails" })
    @Query("SELECT c FROM Contact c WHERE c.user.id = :userId")
    List<Contact> findContactsWithEmails(@Param("userId") String userId);

    @EntityGraph(attributePaths = { "addresses" })
    @Query("SELECT c FROM Contact c WHERE c.user.id = :userId")
    List<Contact> findContactsWithAddresses(@Param("userId") String userId);

    @EntityGraph(attributePaths = { "labels" })
    @Query("SELECT c FROM Contact c WHERE c.user.id = :userId")
    List<Contact> findContactsWithLabels(@Param("userId") String userId);

    @Query("SELECT COUNT(c) FROM Contact c WHERE c.user.id = :userId")
    Long countContactsByUserId(@Param("userId") String userId);

    @Query("SELECT c FROM Contact c WHERE c.user.id = :userId")
    List<Contact> findContactsByUserId(@Param("userId") String userId);

    @Query("SELECT DISTINCT c FROM Contact c WHERE c.user = :user")
    List<Contact> findContactsWithAllData(@Param("user") AppUser user);

    @Query("SELECT c FROM Contact c WHERE c.id = :id AND c.user = :user")
    Optional<Contact> findByIdAndUser(@Param("id") String id, @Param("user") AppUser user);

    // Alternative: Check if contact exists and belongs to user
    @Query("SELECT COUNT(c) > 0 FROM Contact c WHERE c.id = :id AND c.user.id = :userId")
    boolean existsByIdAndUserId(@Param("id") String id, @Param("userId") String userId);

    @Query("SELECT c FROM Contact c WHERE c.id = :id AND c.user.id = :userId")
    Optional<Contact> findByIdAndUserId(@Param("id") String id, @Param("userId") String userId);

    // Check if contact exists
    @Query("SELECT c FROM Contact c WHERE c.id = :id")
    Optional<Contact> findContactById(@Param("id") String id);

    // Get contact with user info for debugging
    @Query("SELECT c FROM Contact c LEFT JOIN FETCH c.user WHERE c.id = :id")
    Optional<Contact> findContactWithUser(@Param("id") String id);

    // Alternative approach - check if they match by email instead of entity
    @Query("SELECT c FROM Contact c WHERE c.id = :id AND c.user.email = :userEmail")
    Optional<Contact> findByIdAndUserEmail(@Param("id") String id, @Param("userEmail") String userEmail);

    @Modifying
    @Query("DELETE FROM Contact c WHERE c.id = :contactId AND c.user = :user")
    int deleteByIdAndUser(@Param("contactId") String contactId, @Param("user") AppUser user);

    @Modifying
    @Query("DELETE FROM Contact c WHERE c.user = :user")
    int deleteByUser(@Param("user") AppUser user);

    @Modifying
    @Query("DELETE FROM Contact c WHERE c.id IN :contactIds AND c.user = :user")
    int deleteByIdsAndUsers(@Param("contactIds") List<String> contactIds, @Param("user") AppUser user);

    @Modifying
    @Query("DELETE FROM Contact c WHERE c.user = :user AND c.isFavourite = true")
    int deleteFavoriteContactsByUser(@Param("user") AppUser user);
}
