package site.devesh.contactsync.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import site.devesh.contactsync.entities.AppUser;
import site.devesh.contactsync.model.AppUserDto;

@Mapper(componentModel = "spring")
public interface UserMapper {

    AppUser toAppUser(AppUserDto appUserDto);

}
