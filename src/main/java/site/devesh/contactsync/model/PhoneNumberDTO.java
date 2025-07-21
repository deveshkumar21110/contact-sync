package site.devesh.contactsync.model;

import lombok.Data;

@Data
public class PhoneNumberDTO {
    private String id;
    private String countryCode;
    private String number;

}
