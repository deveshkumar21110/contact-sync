package site.devesh.contactsync.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "emails")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Email {

    @Id
    private String id;

    private String email;

    @ManyToOne()
    @JoinColumn(name = "contact_id")
    private Contact contact;
}
