package site.devesh.contactsync.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "contacts")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Contact {


    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    private String displayName;
    private String firstName;
    private String lastName;

    private String company;
    private String jobTitle;

    private String imageUrl;
    @Builder.Default
    private Boolean isFavourite = false;
    @Builder.Default
    private Boolean isDeleted = false;
    private LocalDateTime deletedAt;

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

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
    @JoinTable(
            name = "contact_labels",
            joinColumns = @JoinColumn(name= "contact_id"),
            inverseJoinColumns = @JoinColumn(name = "label_id")
    )
    private List<Label> labels;

}
