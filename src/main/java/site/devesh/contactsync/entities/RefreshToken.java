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
@Table(name = "refresh_token")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    private Instant expiryDate;


    @OneToOne
    @JoinColumn(name = "id" , referencedColumnName = "user_id")
    private UserInfo userInfo;

}
