package site.devesh.contactsync.model;


import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import site.devesh.contactsync.entities.AppUser;
import site.devesh.contactsync.entities.UserRole;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class AppUserDto {

    private String id;

    private String username;

    private String phoneNumber;

    private String email;
    private Set<UserRole> roles;
    private String profileImageUrl;

}
