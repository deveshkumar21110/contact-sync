package site.devesh.contactsync.model;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContactPreviewDTO {

    private String id;
    private String displayName;
    private String company;
    private String jobTitle;
    private String imageUrl;
    private Boolean isFavourite;
    private List<PhoneNumberDTO> phoneNumbers;
    private List<EmailDTO> emails;
}
