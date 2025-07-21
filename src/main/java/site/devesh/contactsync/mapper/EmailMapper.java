package site.devesh.contactsync.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import site.devesh.contactsync.entities.Email;
import site.devesh.contactsync.model.EmailDTO;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EmailMapper {

    @Mapping(target = "contact", ignore = true)
    Email toEntity(EmailDTO dto);

    EmailDTO toDto(Email entity);

    List<Email> toEntityList(List<EmailDTO> dtos);

    List<EmailDTO> toDtoList(List<Email> entities);
}

