package site.devesh.contactsync.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import site.devesh.contactsync.entities.RefreshToken;
import site.devesh.contactsync.entities.AppUser;
import site.devesh.contactsync.repo.UserRepo;
import site.devesh.contactsync.request.AuthRequestDTO;
import site.devesh.contactsync.request.RefreshTokenRequest;
import site.devesh.contactsync.response.JwtResponseDTO;
import site.devesh.contactsync.services.impl.JwtService;
import site.devesh.contactsync.services.impl.RefreshTokenService;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/auth/v1")
public class TokenController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserRepo userRepo;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO authRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequestDTO.getEmail(), authRequestDTO.getPassword()));
        if (authentication.isAuthenticated()) {
            // Fetch user from DB
            AppUser user = userRepo.findByEmail(authRequestDTO.getEmail());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(authRequestDTO.getEmail());
            return ResponseEntity.
                    ok(JwtResponseDTO
                            .builder()
                            .accessToken(jwtService.generateToken(authRequestDTO.getEmail()))
                            .token(refreshToken.getToken())
                            .build()
                    );

        } else {
            return ResponseEntity.internalServerError().body("Exception in User Service");
        }

    }

    @PostMapping("/refreshToken")
    public JwtResponseDTO refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        System.out.println("Token received: " + refreshTokenRequest.getToken());
        return refreshTokenService.findByToken(refreshTokenRequest.getToken())
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUserInfo)
                .map(userInfo -> {
                    String accessToken = jwtService.generateToken(userInfo.getEmail());
                    return JwtResponseDTO.builder()
                            .accessToken(accessToken)
                            .token(refreshTokenRequest.getToken()).build();
                }).orElseThrow(() -> new RuntimeException("Refresh Token is not in DB !"));
    }
}
