package site.devesh.contactsync.mapper;
import org.mapstruct.*;
import site.devesh.contactsync.entities.Contact;
import site.devesh.contactsync.request.ContactRequestDTO;
import site.devesh.contactsync.response.ContactResponseDTO;

import java.util.List;
@Mapper(
        componentModel = "spring",
        uses = {
                PhoneNumberMapper.class,
                EmailMapper.class,
                AddressMapper.class,
                WebsiteMapper.class,
                SignificantDateMapper.class,
                LabelMapper.class
        }
)
public abstract class ContactMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "displayName", expression = "java(dto.getFirstName() + \" \" + dto.getLastName())")
    public abstract Contact toContact(ContactRequestDTO dto);

    public abstract ContactResponseDTO toContactResponseDTO(Contact contact);

    public abstract List<ContactResponseDTO> toContactResponseDTOList(List<Contact> contacts);

    @AfterMapping
    protected void linkChildEntities(@MappingTarget Contact contact) {
        if (contact.getPhoneNumbers() != null) {
            contact.getPhoneNumbers().forEach(p -> p.setContact(contact));
        }
        if (contact.getEmails() != null) {
            contact.getEmails().forEach(e -> e.setContact(contact));
        }
        if (contact.getAddresses() != null) {
            contact.getAddresses().forEach(a -> a.setContact(contact));
        }
        if (contact.getWebsites() != null) {
            contact.getWebsites().forEach(w -> w.setContact(contact));
        }
        if (contact.getSignificantDates() != null) {
            contact.getSignificantDates().forEach(s -> s.setContact(contact));
        }
    }
}
