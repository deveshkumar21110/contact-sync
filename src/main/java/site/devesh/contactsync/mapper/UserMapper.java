package site.devesh.contactsync.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import site.devesh.contactsync.entities.AppUser;
import site.devesh.contactsync.model.AppUserDto;
import site.devesh.contactsync.services.impl.CustomUserDetails;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import site.devesh.contactsync.entities.UserRole;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // Existing mapping from DTO to Entity
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "username", ignore = true)
    AppUser toAppUser(AppUserDto appUserDto);

    // NEW: Convert from AppUser entity to DTO
    @Mapping(source = "username", target = "userName")
    @Mapping(source = "phoneNumber", target = "phoneNumber", qualifiedByName = "stringToLong")
    AppUserDto toAppUserDto(AppUser appUser);

    // NEW: Convert from CustomUserDetails to DTO (This is what you need!)
    @Mapping(source = "username", target = "userName")
    @Mapping(source = "phoneNumber", target = "phoneNumber", qualifiedByName = "stringToLong")
    @Mapping(source = "roles", target = "roles", qualifiedByName = "setToList")
    AppUserDto customUserDetailsToDto(CustomUserDetails userDetails);

    // Helper method to convert String phone number to Long
    @Named("stringToLong")
    default Long stringToLong(String phoneNumber) {
        if (phoneNumber != null && !phoneNumber.trim().isEmpty()) {
            try {
                return Long.parseLong(phoneNumber.trim());
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    // Helper method to convert Set<UserRole> to List<UserRole>
    @Named("setToList")
    default List<UserRole> setToList(Set<UserRole> roles) {
        return roles != null ? new ArrayList<>(roles) : new ArrayList<>();
    }
}