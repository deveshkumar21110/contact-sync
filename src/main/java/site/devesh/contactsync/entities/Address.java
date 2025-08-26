package site.devesh.contactsync.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "addresses")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Address {


    @Id
    private String id;

    private String country;
    private String streetAddress;
    private String streetAddress2;
    private String city;
    private String pincode;
    private String state;

    @ManyToOne()
    @JoinColumn(name = "contact_id", nullable = false) // The nullable = false ensures that Hibernate won’t just try to SET contact_id = NULL
    private Contact contact;

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
