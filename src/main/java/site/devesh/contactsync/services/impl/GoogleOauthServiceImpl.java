package site.devesh.contactsync.services.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import site.devesh.contactsync.entities.AppUser;
import site.devesh.contactsync.entities.RefreshToken;
import site.devesh.contactsync.repo.UserRepo;
import site.devesh.contactsync.request.SignUpRequestDto;
import site.devesh.contactsync.response.GoogleUserInfoResponse;
import site.devesh.contactsync.response.JwtResponseDTO;
import site.devesh.contactsync.services.GoogleOauthService;

@Service
public class GoogleOauthServiceImpl implements GoogleOauthService {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Override
    public JwtResponseDTO handleGoogleCallback(String code) {
        try {
            // Exchange Authorization code for getting access token and refresh token
            String tokenEndPoint = "https://oauth2.googleapis.com/token";
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("code", code);
            params.add("client_id", clientId);
            params.add("client_secret", clientSecret);
            params.add("redirect_uri", redirectUri);
            params.add("grant_type", "authorization_code");

            // Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            // Http request
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

            ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(tokenEndPoint, request, Map.class);

            String accessToken = (String) tokenResponse.getBody().get("access_token");
            String refreshToken = (String) tokenResponse.getBody().get("refresh_token");
            // 2. Fetch Google user info
            HttpHeaders userHeaders = new HttpHeaders();
            userHeaders.setBearerAuth(accessToken);

            HttpEntity<Void> userRequest = new HttpEntity<>(userHeaders);

            ResponseEntity<GoogleUserInfoResponse> userInfoResponse = restTemplate.exchange(
                    "https://www.googleapis.com/oauth2/v2/userinfo",
                    HttpMethod.GET,
                    userRequest,
                    GoogleUserInfoResponse.class);

            GoogleUserInfoResponse googleUser = userInfoResponse.getBody();
            // 3. Check user exists
            AppUser user = userRepo.findByEmail(googleUser.getEmail());

            if (user == null) {
                // AUTO SIGNUP
                SignUpRequestDto signUpRequestDto = new SignUpRequestDto();
                signUpRequestDto.setEmail(googleUser.getEmail());
                signUpRequestDto.setUsername(googleUser.getName());
                signUpRequestDto.setPassword(UUID.randomUUID().toString());
                signUpRequestDto.setProfileImageUrl(googleUser.getPicture());

                userDetailsServiceImpl.signUpUser(signUpRequestDto);
                // reload user after signup
                user = userRepo.findByEmail(googleUser.getEmail());
            }
            return loginGoogleUser(user);
        } catch (Exception e) {
            throw new RuntimeException("Google OAuth failed", e);
        }
    }

    private JwtResponseDTO loginGoogleUser(AppUser appUser) {
        Authentication authentication = new UsernamePasswordAuthenticationToken(appUser.getEmail(), null,
                new CustomUserDetails(appUser).getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = jwtService.generateToken(appUser.getEmail());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(appUser.getEmail());

        return JwtResponseDTO.builder().accessToken(accessToken)
                .token(refreshToken.getToken())
                .build();
    }

}
