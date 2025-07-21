package site.devesh.contactsync.model;


import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import site.devesh.contactsync.entities.AppUser;
import site.devesh.contactsync.entities.UserRole;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class AppUserDto {

    private String id;

    private String userName;

    private Long phoneNumber;

    private String email;
    private List<UserRole> roles;
    private String profileImageUrl;

}
