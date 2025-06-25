package site.devesh.contactsync.services;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import site.devesh.contactsync.entities.UserInfo;
import site.devesh.contactsync.entities.UserRole;
import site.devesh.contactsync.model.UserInfoDto;
import site.devesh.contactsync.repo.UserRepo;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Service
@AllArgsConstructor
@Data
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserInfo userInfo = userRepo.findByUsername(username);
        if(userInfo == null) {
            throw new UsernameNotFoundException("could not found user..!!");
        }
        return new CustomUserDetails(userInfo);
    }

    public UserInfo checkUserAlreadyExist(UserInfoDto userInfoDto){
        return userRepo.findByUsername(userInfoDto.getUsername());
    }

    public Boolean SignUpUser(UserInfoDto userInfoDto){
        if(Objects.nonNull(checkUserAlreadyExist(userInfoDto))) return false;
        userInfoDto.setPassword(encoder.encode(userInfoDto.getPassword()));
        String userId = UUID.randomUUID().toString();
        Set<UserRole> roles = new HashSet<>();
        roles.add(new UserRole(null, "ROLE_USER"));
        userRepo.save(new UserInfo(userId,userInfoDto.getUsername(),userInfoDto.getPassword(),roles));
        return true;
    }
}
