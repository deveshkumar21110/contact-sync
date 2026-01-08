package site.devesh.contactsync.response;
import lombok.Data;

@Data
public class GoogleUserInfoResponse {
    private String email;
    private String name;
    private String picture;
    private Boolean email_verified;
}
