package site.devesh.contactsync.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/v1")
public class GoogleOauthController {
    
    // @GetMapping("/callback")
    // public ResponseEntity<?> googleCallback(@RequestParam String code){
    //     try {
            
    //     } catch (Exception e) {

    //         return ResponseEntity.internalServerError().body(e);
    //     }
    // }
}
