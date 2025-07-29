package site.devesh.contactsync.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.PrePersist;
import java.util.UUID;

@Entity
@Table(name = "websites")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Website {

    @Id
    private String id;

    private String url;

    @ManyToOne
    @JoinColumn(name = "contact_id")
    private Contact contact;

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
