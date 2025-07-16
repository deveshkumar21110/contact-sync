package site.devesh.contactsync.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    @JoinColumn(name = "contact_id")
    private Contact contact;
}
