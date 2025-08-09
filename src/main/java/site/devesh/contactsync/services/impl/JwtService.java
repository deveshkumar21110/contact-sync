package site.devesh.contactsync.services.impl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.key}")
    private String key;
    @Value("${jwt.expiration}")
    private Long expiration;

    private final ApplicationContext applicationContext;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    public JwtService(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    public String extractUserId(String token) {
        return extractClaims(token, Claims::getSubject); // userId is called subject in jwt
    }

    public Date extractExpiration(String token) {
        return extractClaims(token, Claims::getExpiration);
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, CustomUserDetails userDetails) {
        final String userId = extractUserId(token);
        Boolean isTokenExpired = isTokenExpired(token);
        if(!isTokenExpired) {
            Date expirationDate = extractExpiration(token);
            Instant now = Instant.now();
            Instant expirationInstant = expirationDate.toInstant();

            long minutes = Duration.between(now, expirationInstant).toMinutes();
            logger.info("Token expires in {} minutes", minutes);
        }
        return userId.equals(userDetails.getId()) && !isTokenExpired;
    }

    public <T> T extractClaims(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private List<String> extractRoles(String token){
        Claims claims = extractAllClaims(token);
        Object rolesObject = claims.get("roles");
        if(rolesObject instanceof List<?>){
            return ((List<?>) rolesObject).stream().map(Object::toString).toList();
        }
        return List.of();
    }

    public String generateToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        
        // Get UserDetailsService lazily to avoid circular dependency
        UserDetailsServiceImpl userDetailsService = applicationContext.getBean(UserDetailsServiceImpl.class);
        CustomUserDetails userDetails = userDetailsService.loadUserByUsername(email);
        
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        claims.put("roles", roles);

        return Jwts.builder()
                .claims().add(claims)
                .subject(userDetails.getId())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + Duration.ofDays(1).toMillis()))
                .and()
                .signWith(getKey())
                .compact();
    }

    private SecretKey getKey() {
        byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}