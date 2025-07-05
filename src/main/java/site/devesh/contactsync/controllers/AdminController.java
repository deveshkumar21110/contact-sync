package site.devesh.contactsync.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import site.devesh.contactsync.entities.UserInfo;
import site.devesh.contactsync.model.UserInfoDto;
import site.devesh.contactsync.services.UserDetailsServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @GetMapping("/users")
    public List<UserInfo> getAllUsers(){
        return userDetailsService.findAllUsers();
    }
}
