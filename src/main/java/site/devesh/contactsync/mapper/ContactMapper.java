package site.devesh.contactsync.mapper;

import org.mapstruct.*;
import site.devesh.contactsync.entities.*;
import site.devesh.contactsync.model.*;
import site.devesh.contactsync.request.ContactRequestDTO;
import site.devesh.contactsync.response.ContactResponseDTO;
import java.util.List;
import java.util.ArrayList;

@Mapper(componentModel = "spring", uses = {
        PhoneNumberMapper.class,
        EmailMapper.class,
        AddressMapper.class,
        WebsiteMapper.class,
        SignificantDateMapper.class,
        LabelMapper.class
})
public interface ContactMapper {

    // Create new contact from DTO
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "displayName", ignore = true) // Will be set in service
    @Mapping(target = "labels", ignore = true) // Will be handled in service
    Contact toContact(ContactRequestDTO dto);

    // Convert entity to DTO
    @Mapping(target = "phoneNumbers", source = "phoneNumbers")
    @Mapping(target = "emails", source = "emails")
    @Mapping(target = "addresses", source = "addresses")
    @Mapping(target = "websites", source = "websites")
    @Mapping(target = "significantDates", source = "significantDates")
    @Mapping(target = "labels", source = "labels")
    ContactRequestDTO toDto(Contact entity);

    // List conversions
    List<Contact> toEntityList(List<ContactRequestDTO> dtos);

    List<ContactRequestDTO> toDtoList(List<Contact> entities);

    // Convert to response DTO
    ContactResponseDTO toContactResponseDTO(Contact contact);

    List<ContactResponseDTO> toContactResponseDTOList(List<Contact> contacts);
    List<ContactPreviewDTO> toContactPreviewDTOList(List<Contact> contacts);

    // Update contact basic fields only (no collections)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "displayName", ignore = true)
    @Mapping(target = "phoneNumbers", ignore = true)
    @Mapping(target = "emails", ignore = true)
    @Mapping(target = "addresses", ignore = true)
    @Mapping(target = "websites", ignore = true)
    @Mapping(target = "significantDates", ignore = true)
    @Mapping(target = "labels", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateBasicFields(ContactRequestDTO dto, @MappingTarget Contact contact);

    // Complete update including collections
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "displayName", ignore = true)
    @Mapping(target = "labels", ignore = true)
    @Mapping(target = "phoneNumbers", ignore = true)
    @Mapping(target = "emails", ignore = true)
    @Mapping(target = "addresses", ignore = true)
    @Mapping(target = "websites", ignore = true)
    @Mapping(target = "significantDates", ignore = true)
    void updateContactFromDto(ContactRequestDTO dto, @MappingTarget Contact contact);

    @AfterMapping
    default void afterUpdateContact(ContactRequestDTO dto, @MappingTarget Contact contact) {
        // Update display name
        String firstName = contact.getFirstName() != null ? contact.getFirstName().trim() : "";
        String lastName = contact.getLastName() != null ? contact.getLastName().trim() : "";
        contact.setDisplayName((firstName + " " + lastName).trim());
    }
}