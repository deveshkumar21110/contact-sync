package site.devesh.contactsync.services;

import org.springframework.stereotype.Service;
import site.devesh.contactsync.model.AppUserDto;
import site.devesh.contactsync.request.AuthRequestDTO;

@Service
public interface UserService {

    public AppUserDto getCurrentUser();
}
