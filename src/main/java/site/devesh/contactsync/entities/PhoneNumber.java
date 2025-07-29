package site.devesh.contactsync.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.PrePersist;
import java.util.UUID;

@Entity
@Table(name = "phone_numbers")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PhoneNumber {

    @Id
    private String id;

    private String countryCode;
    private String number;

    @ManyToOne()
    @JoinColumn(name = "contact_id")
    private Contact contact;

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
