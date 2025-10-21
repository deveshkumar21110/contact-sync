package site.devesh.contactsync.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import site.devesh.contactsync.entities.AppUser;
import site.devesh.contactsync.model.AppUserDto;
import site.devesh.contactsync.services.impl.CustomUserDetails;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // Existing mapping from DTO to Entity
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "username", ignore = true)
    AppUser toAppUser(AppUserDto appUserDto);

    // Convert from AppUser entity to DTO
    @Mapping(source = "username", target = "username")
    AppUserDto toAppUserDto(AppUser appUser);

    // Convert from CustomUserDetails to DTO 
    @Mapping(source = "username", target = "username")
    AppUserDto customUserDetailsToDto(CustomUserDetails userDetails);
}