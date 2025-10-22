package site.devesh.contactsync.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import site.devesh.contactsync.model.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContactResponseDTO {
    private String id;
    private String displayName;
    private String firstName;
    private String lastName;
    private String company;
    private String jobTitle;
    private String imageUrl;
    private Boolean isFavourite;
    private Boolean isDeleted;
    private LocalDateTime deletedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<PhoneNumberDTO> phoneNumbers;
    private List<EmailDTO> emails;
    private List<AddressDTO> addresses;
    private List<WebsiteDTO> websites;
    private List<SignificantDateDTO> significantDates;
    private List<LabelDTO> labels;
}
