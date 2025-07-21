package site.devesh.contactsync.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import site.devesh.contactsync.entities.PhoneNumber;
import site.devesh.contactsync.model.PhoneNumberDTO;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PhoneNumberMapper {

    @Mapping(target = "contact", ignore = true)
    PhoneNumber toEntity(PhoneNumberDTO dto);

    PhoneNumberDTO toDto(PhoneNumber entity);

    List<PhoneNumber> toEntityList(List<PhoneNumberDTO> dtos);

    List<PhoneNumberDTO> toDtoList(List<PhoneNumber> entities);
}
