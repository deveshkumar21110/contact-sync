package site.devesh.contactsync.controllers.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import site.devesh.contactsync.model.AppUserDto;
import site.devesh.contactsync.services.UserService;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/update")
    public ResponseEntity<AppUserDto> updateUserDto(@RequestBody AppUserDto appUserDto){
        try {
            AppUserDto updatedAppUserDto = userService.updateCurrentAppUserDto(appUserDto);
            return ResponseEntity.ok().body(updatedAppUserDto);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
