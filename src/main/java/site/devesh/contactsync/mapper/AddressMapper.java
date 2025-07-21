package site.devesh.contactsync.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import site.devesh.contactsync.entities.Address;
import site.devesh.contactsync.model.AddressDTO;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AddressMapper {

    @Mapping(target = "contact", ignore = true)
    Address toEntity(AddressDTO dto);

    AddressDTO toDto(Address entity);

    List<Address> toEntityList(List<AddressDTO> dtos);

    List<AddressDTO> toDtoList(List<Address> entities);
}
