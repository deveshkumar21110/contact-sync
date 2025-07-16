package site.devesh.contactsync.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import site.devesh.contactsync.entities.UserRole;
import site.devesh.contactsync.enums.RoleType;
import site.devesh.contactsync.repo.UserRoleRepo;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserRoleService {

    private final UserRoleRepo userRoleRepo;

    // create role
    public UserRole createRole(UserRole userRole) {
        return userRoleRepo.save(userRole);
    }

    // get All Roles
    public List<UserRole> getAllRole() {
        return userRoleRepo.findAll();
    }

    // get role by id
    public UserRole getRoleById(Long id) {
        return userRoleRepo.findById(id).orElseThrow(() ->
                new RuntimeException("Default role not found"));
    }

    // get role by name
    public UserRole getRoleByName(RoleType name){
        return userRoleRepo.findByName(name).orElse(null);
    }
}

