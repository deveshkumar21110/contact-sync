package site.devesh.contactsync.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import site.devesh.contactsync.response.JwtResponseDTO;
import site.devesh.contactsync.services.impl.GoogleOauthServiceImpl;

@RestController
@RequestMapping("/auth/v1")
public class GoogleOauthController {

    @Autowired
    GoogleOauthServiceImpl googleOauthServiceImpl;

    @GetMapping("/callback")
    public ResponseEntity<?> googleCallback(@RequestParam String code) {
        try {
            JwtResponseDTO jwtResponseDTO = googleOauthServiceImpl.handleGoogleCallback(code);
            return ResponseEntity.ok(jwtResponseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Google Login failed");
        }
    }
}
