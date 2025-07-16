package site.devesh.contactsync.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "significant_date")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SignificantDate {

    @Id
    private String id;

    private String date;
    private String month;
    private String year;

    @ManyToOne
    @JoinColumn(name = "contact_id")
    private Contact contact;
}
