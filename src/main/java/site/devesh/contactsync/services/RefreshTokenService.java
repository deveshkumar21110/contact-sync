package site.devesh.contactsync.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import site.devesh.contactsync.entities.RefreshToken;
import site.devesh.contactsync.entities.UserInfo;
import site.devesh.contactsync.repo.RefreshTokenRepo;
import site.devesh.contactsync.repo.UserRepo;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepo refreshTokenRepo;

    @Autowired
    private UserRepo userRepo;

    @Value("${jwt.refresh-token.expiration}")
    private long  refreshTokenExpiration;

    @Transactional
    public RefreshToken createRefreshToken(String username) {
        UserInfo userInfo = userRepo.findByUsername(username);
        if (userInfo == null) {
            throw new RuntimeException("User not found: " + username);
        }

        try {
            // Delete any existing refresh tokens for this user
            refreshTokenRepo.deleteByUserInfo(userInfo);
            refreshTokenRepo.flush(); // Ensure delete is committed before insert

            RefreshToken refreshToken = RefreshToken
                    .builder()
                    .userInfo(userInfo)
                    .token(UUID.randomUUID().toString())
                    .expiryDate(Instant.now().plus(Duration.ofMillis(refreshTokenExpiration)))
                    .build();

            return refreshTokenRepo.save(refreshToken);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create refresh token: " + e.getMessage(), e);
        }
    }

    public RefreshToken verifyExpiration(RefreshToken refreshToken) {
        if(refreshToken.getExpiryDate().compareTo(Instant.now()) < 0){
            refreshTokenRepo.delete(refreshToken);
            throw new RuntimeException(refreshToken.getToken() + " this refresh token is expired, Please make a new login");
        }
        return refreshToken;
    }

    public Optional<RefreshToken> findByToken(String token){
        return refreshTokenRepo.findByToken(token);
    }

}
