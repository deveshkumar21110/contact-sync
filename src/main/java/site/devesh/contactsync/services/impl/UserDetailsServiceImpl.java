package site.devesh.contactsync.services.impl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import site.devesh.contactsync.entities.AppUser;
import site.devesh.contactsync.entities.UserRole;
import site.devesh.contactsync.enums.RoleType;
import site.devesh.contactsync.exceptions.UnauthorizedException;
import site.devesh.contactsync.model.AppUserDto;
import site.devesh.contactsync.repo.UserRepo;
import site.devesh.contactsync.request.SignUpRequestDto;
import site.devesh.contactsync.services.UserService;

import java.util.*;

@Service
public class UserDetailsServiceImpl implements UserDetailsService, UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private UserRoleService userRoleService;

    @Autowired
    private PasswordEncoder encoder;


    @Override
    public CustomUserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AppUser userInfo = userRepo.findByEmail(email);
        if (userInfo == null) {
            throw new UsernameNotFoundException("could not found user with this email : " + email);
        }
        return new CustomUserDetails(userInfo);
    }

    public CustomUserDetails loadUserById(String userId) throws UsernameNotFoundException {
        return userRepo.findById(userId)
                .map(CustomUserDetails::new) // UserInfo → CustomUserDetails
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));
    }

    public AppUser checkUserAlreadyExist(SignUpRequestDto signUpRequestDto) {
        return userRepo.findByEmail(signUpRequestDto.getEmail());
    }

    public Boolean signUpUser(SignUpRequestDto signUpRequestDto) {
        // Check if user already exists
        if (checkUserAlreadyExist(signUpRequestDto) != null) {
            return false; // user already exists → don't proceed
        }

        // Encode password
        signUpRequestDto.setPassword(encoder.encode(signUpRequestDto.getPassword()));
        String userId = UUID.randomUUID().toString();

        // Always try to fetch role from DB
        UserRole role = userRoleService.getRoleByName(RoleType.ROlE_USER);

        // If not found, create it
        if (role == null) {
            role = userRoleService.createRole(new UserRole(null, RoleType.ROlE_USER));
        }

        // Assign a role to new user
        Set<UserRole> roles = new HashSet<>();
        roles.add(role);

        AppUser user = AppUser.builder()
                .id(userId)
                .email(signUpRequestDto.getEmail())
                .username(signUpRequestDto.getUsername())
                .password(signUpRequestDto.getPassword())
                .roles(roles)
                .phoneNumber(signUpRequestDto.getPhoneNumber())
                .profileImageUrl(signUpRequestDto.getProfileImageUrl())
                .build();

        userRepo.save(user);
        return true;
    }

    public List<AppUser> findAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public AppUserDto getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Check authentication
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }

        // Check for anonymous users
        if (authentication instanceof AnonymousAuthenticationToken) {
            throw new UnauthorizedException("Anonymous user cannot access this resource");
        }

        // Extract and return user data
        if (authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            return userDetails.toAppUserDto(); // THIS WAS MISSING IN YOUR CODE
        }

        throw new UnauthorizedException("Invalid authentication principal type");
    }
}
