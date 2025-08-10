package site.devesh.contactsync.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Label {

    @Id
    private String id;

    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    // @JoinColumn(name = "user_id", nullable = false)
    private AppUser appUser;

    @ManyToMany(mappedBy = "labels")
    private List<Contact> contacts;

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }

    public void addContact(Contact contact) {
        if (contacts == null) {
            contacts = new ArrayList<>();
        }
        if (!contacts.contains(contact)) {
            contacts.add(contact);
            contact.addLabel(this); // Keep the reverse link in sync
        }
    }

    public void removeContact(Contact contact) {
        if (contacts != null && contacts.remove(contact)) {
            contact.removeLabel(this);
        }
    }

}
