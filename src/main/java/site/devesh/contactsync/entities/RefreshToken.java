package site.devesh.contactsync.entities;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Builder
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(
    name = "refresh_token",
    // user_id is unique across rows in the refresh_token table
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "user_id")
    }
)
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //  token is unique and cannot be null.
    @Column(nullable = false, unique = true)
    private String token;

    private Instant expiryDate;


    @OneToOne
    @JoinColumn(name = "user_id" , referencedColumnName = "user_id")
    private AppUser userInfo;

}
