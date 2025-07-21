package site.devesh.contactsync.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import site.devesh.contactsync.entities.SignificantDate;
import site.devesh.contactsync.model.SignificantDateDTO;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SignificantDateMapper {

    @Mapping(target = "contact", ignore = true)
    SignificantDate toEntity(SignificantDateDTO dto);

    SignificantDateDTO toDto(SignificantDate entity);

    List<SignificantDate> toEntityList(List<SignificantDateDTO> dtos);

    List<SignificantDateDTO> toDtoList(List<SignificantDate> entities);
}
