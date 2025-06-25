package site.devesh.contactsync.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.io.Decoders;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;

import java.time.Duration;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.key}")
    private String key;
    @Value("${jwt.expiration}")
    private Long expiration;

    public String extractUsername(String token) {
        return extractClaims(token, Claims::getSubject); // username is called subject in jwt
    }


    public Date extractExpiration(String token) {
        return extractClaims(token, Claims::getExpiration);
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    public <T> T extractClaims(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }


//    This method verifies the JWT token using your secret key and then returns the claims (data inside the token) like username, roles, expiration time, etc.

    private Claims extractAllClaims(String token) {
        // parser is similar to builder
        return Jwts.parser()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        String token = Jwts
                .builder()
                .claims().add(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + Duration.ofDays(1).toMillis()))
                .and().signWith(getKey())
                .compact();


        return token;
    }


    private SecretKey getKey() {
        byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
