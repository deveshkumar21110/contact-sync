package site.devesh.contactsync.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import site.devesh.contactsync.entities.RefreshToken;
import site.devesh.contactsync.model.AppUserDto;
import site.devesh.contactsync.request.AuthRequestDTO;
import site.devesh.contactsync.request.SignUpRequestDto;
import site.devesh.contactsync.response.JwtResponseDTO;
import site.devesh.contactsync.services.impl.JwtService;
import site.devesh.contactsync.services.impl.RefreshTokenService;
import site.devesh.contactsync.services.impl.UserDetailsServiceImpl;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/auth/v1")
public class AuthController {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;
    private final RefreshTokenService refreshTokenService;

    public AuthController(JwtService jwtService, UserDetailsServiceImpl userDetailsService, RefreshTokenService refreshTokenService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody SignUpRequestDto signUpRequestDto) {
        try {
            if (!userDetailsService.signUpUser(signUpRequestDto)) {
                return ResponseEntity.badRequest().body("Account already exists");
            }

            RefreshToken refreshToken = refreshTokenService.createRefreshToken(signUpRequestDto.getEmail());
            String jwtToken = jwtService.generateToken(signUpRequestDto.getEmail());
            return new ResponseEntity<>(JwtResponseDTO
                    .builder()
                    .accessToken(jwtToken)
                    .token(refreshToken.getToken())
                    .build(), HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<>("Exception in User Service", HttpStatus.INTERNAL_SERVER_ERROR );
        }
    }

    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser() {
        return new ResponseEntity<>(userDetailsService.getCurrentUser(), HttpStatus.OK);
    }

}
