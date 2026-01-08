package site.devesh.contactsync.services;

import site.devesh.contactsync.entities.AppUser;
import site.devesh.contactsync.response.JwtResponseDTO;

public interface GoogleOauthService {
    
    public JwtResponseDTO handleGoogleCallback(String code);
}
