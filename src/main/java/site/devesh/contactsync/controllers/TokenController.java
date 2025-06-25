package site.devesh.contactsync.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import site.devesh.contactsync.entities.RefreshToken;
import site.devesh.contactsync.model.UserInfoDto;
import site.devesh.contactsync.request.AuthRequestDTO;
import site.devesh.contactsync.request.RefreshTokenRequest;
import site.devesh.contactsync.response.JwtResponseDTO;
import site.devesh.contactsync.services.JwtService;
import site.devesh.contactsync.services.RefreshTokenService;

@RestController
@RequestMapping("/auth/v1/")
public class TokenController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO authRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequestDTO.getUsername(), authRequestDTO.getPassword()));
        if (authentication.isAuthenticated()) {
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(authRequestDTO.getUsername());
            return ResponseEntity.
                    ok(JwtResponseDTO
                            .builder()
                            .accessToken(jwtService.generateToken(authRequestDTO.getUsername()))
                            .token(refreshToken.getToken())
                            .build()
                    );

        } else {
            return ResponseEntity.internalServerError().body("Exception in User Service");
        }

    }

    @PostMapping("refreshToken")
    public JwtResponseDTO refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        return refreshTokenService.findByToken(refreshTokenRequest.getToken())
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUserInfo)
                .map(userInfo -> {
                    String accessToken = jwtService.generateToken(userInfo.getUsername());
                    return JwtResponseDTO.builder()
                            .accessToken(accessToken)
                            .token(refreshTokenRequest.getToken()).build();
                }).orElseThrow(() -> new RuntimeException("Refresh Token is not in DB !"));
    }
}
