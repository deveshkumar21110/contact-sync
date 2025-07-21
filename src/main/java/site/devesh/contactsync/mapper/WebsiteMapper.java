package site.devesh.contactsync.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import site.devesh.contactsync.entities.Website;
import site.devesh.contactsync.model.WebsiteDTO;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WebsiteMapper {

    @Mapping(target = "contact", ignore = true)
    Website toEntity(WebsiteDTO dto);

    WebsiteDTO toDto(Website entity);

    List<Website> toEntityList(List<WebsiteDTO> dtos);

    List<WebsiteDTO> toDtoList(List<Website> entities);
}
