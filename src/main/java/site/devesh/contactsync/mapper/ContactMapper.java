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
public interface ContactMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "displayName", expression = "java(dto.getFirstName() + \" \" + dto.getLastName())")
    Contact toContact(ContactRequestDTO dto);

    @InheritInverseConfiguration
    ContactRequestDTO toDto(Contact contact);

    List<ContactRequestDTO> toDtoList(List<Contact> contacts);
    List<Contact> toEntityList(List<ContactRequestDTO> contactDTOs);

    ContactResponseDTO toContactResponseDTO(Contact contact);

    List<ContactResponseDTO> toContactResponseDTOList(List<Contact> contacts);
}