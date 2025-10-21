package site.devesh.contactsync.services.impl;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import site.devesh.contactsync.entities.AppUser;
import site.devesh.contactsync.entities.UserRole;
import site.devesh.contactsync.model.AppUserDto;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

public class CustomUserDetails implements UserDetails {

    // Core UserDetails fields
    private String username;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    // Extended user information (THIS IS THE KEY - store ALL needed data)
    @Getter @Setter private String id;
    @Getter @Setter private String email;
    @Getter @Setter private String profileImageUrl;
    @Getter @Setter private String phoneNumber;
    @Getter @Setter private Set<UserRole> roles;

    // Constructor - Load ALL user data once during authentication
    public CustomUserDetails(AppUser user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.email = user.getEmail();
        this.profileImageUrl = user.getProfileImageUrl();
        this.phoneNumber = user.getPhoneNumber();
        this.roles = user.getRoles();

        // Build authorities from roles
        this.authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().toString()))
                .collect(Collectors.toList());
    }

    public AppUserDto toAppUserDto() {
        AppUserDto dto = new AppUserDto();
        dto.setId(this.id);
        dto.setUsername(this.username);
        dto.setEmail(this.email);
        dto.setProfileImageUrl(this.profileImageUrl);
        
        // Handle phone number conversion safely
        dto.setPhoneNumber(this.phoneNumber);
        dto.setRoles(this.roles);
        
        return dto;
    }

    // Standard UserDetails implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}