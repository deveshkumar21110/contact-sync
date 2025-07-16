package site.devesh.contactsync.services.impl;

import lombok.Getter;
import lombok.Setter;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import site.devesh.contactsync.entities.AppUser;
import site.devesh.contactsync.entities.UserRole;
import site.devesh.contactsync.model.AppUserDto;
import site.devesh.contactsync.response.JwtResponseDTO;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class CustomUserDetails extends AppUser implements UserDetails {

    // three basic details - username,password,authorities/roles
    @Setter
    @Getter
    private String id;

    @Setter
    @Getter
    private String email;

    private String username;

    private String password;

    Collection<? extends GrantedAuthority> authorities;




    public CustomUserDetails(AppUser loadedUser){
        this.username = loadedUser.getUsername();
        this.password = loadedUser.getPassword();
        this.email = loadedUser.getEmail();
        this.id = loadedUser.getId();

        List<GrantedAuthority> auths = new ArrayList<>();
        for(UserRole userRole : loadedUser.getRoles()){
            System.out.println("DEBUG: Adding role -> " + userRole.getName());
            auths.add(new SimpleGrantedAuthority(userRole.getName().toString()));
        }
        this.authorities = auths;

        System.out.println("DEBUG: Final authorities -> " + this.authorities);
    }


    //    getAuthorities() returns the user's roles/permissions; List.of() means the user has none.
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public void setPassword(String password) {
        this.password = password;
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
