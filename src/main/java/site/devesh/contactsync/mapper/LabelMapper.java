package site.devesh.contactsync.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import site.devesh.contactsync.entities.Label;
import site.devesh.contactsync.model.LabelDTO;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LabelMapper {

    // Ignore contacts list to avoid infinite recursion
    @Mapping(target = "contacts", ignore = true)
    @Mapping(target = "appUser", ignore = true)
    Label toEntity(LabelDTO dto);
    
    LabelDTO toDto(Label entity);

    List<Label> toEntityList(List<LabelDTO> dtos);

    List<LabelDTO> toDtoList(List<Label> entities);
}
