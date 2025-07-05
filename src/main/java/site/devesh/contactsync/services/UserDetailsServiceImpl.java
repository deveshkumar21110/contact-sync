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
import site.devesh.contactsync.enums.RoleType;
import site.devesh.contactsync.model.UserInfoDto;
import site.devesh.contactsync.repo.UserRepo;
import site.devesh.contactsync.repo.UserRoleRepo;

import java.util.*;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private UserRoleService userRoleService;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserInfo userInfo = userRepo.findByUsername(username);
        if(userInfo == null) {
            throw new UsernameNotFoundException("could not found user..!!" + username);
        }
        return new CustomUserDetails(userInfo);
    }

    public UserInfo checkUserAlreadyExist(UserInfoDto userInfoDto){
        return userRepo.findByUsername(userInfoDto.getUsername());
    }

    public Boolean SignUpUser(UserInfoDto userInfoDto) {
        if (Objects.nonNull(checkUserAlreadyExist(userInfoDto))) return false;

        userInfoDto.setPassword(encoder.encode(userInfoDto.getPassword()));
        String userId = UUID.randomUUID().toString();

        //  Fetch role from DB (assuming you have UserRoleRepository)
//        UserRole role = userRoleService.getRoleByName("ROLE_USER");
//        if(role == null){
            UserRole role = userRoleService.createRole(new UserRole(null, RoleType.ROlE_USER));
//        }
        Set<UserRole> roles = new HashSet<>();
        roles.add(role);

        userRepo.save(new UserInfo(userId, userInfoDto.getUsername(), userInfoDto.getPassword(), roles));
        return true;
    }


    public List<UserInfo> findAllUsers(){
        return userRepo.findAll();
    }
}
