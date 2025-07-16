package site.devesh.contactsync.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "contacts")
public class Contact {


    @Id
    @Column(name = "id" , updatable = false, nullable = false)
    private String id;

    private String displayName;
    private String firstName;
    private String lastName;

    private String company;
    private String jobTitle;

    private String imageUrl;
    private Boolean isFavourite = false;
    private Boolean isDeleted = false;
    private LocalDateTime deletedAt;

    private String address;
    private String website;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @CreationTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL)
    private List<PhoneNumber> phoneNumbers;

    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL)
    private List<Email> emails;


    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL)
    private List<Address> addresses;

    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL)
    private List<Website> websites;

    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL)
    private List<SignificantDate> significantDates;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "contact_labels",
            joinColumns = @JoinColumn(name= "contact_id"),
            inverseJoinColumns = @JoinColumn(name = "label_id")
    )
    private List<Label> labels;

    @PrePersist
    public void generateId() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
    }
}
