package site.devesh.contactsync.model;

import lombok.Data;

@Data
public class AddressDTO {

    private String id;

    private String country;
    private String streetAddress;
    private String streetAddress2;
    private String city;
    private String pincode;
    private String state;
}
