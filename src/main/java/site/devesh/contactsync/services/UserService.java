package site.devesh.contactsync.services;

import org.springframework.stereotype.Service;
import site.devesh.contactsync.model.AppUserDto;

@Service
public interface UserService {

    public AppUserDto getCurrentUser();
    public AppUserDto updateCurrentAppUserDto(AppUserDto appUserDto);
}
