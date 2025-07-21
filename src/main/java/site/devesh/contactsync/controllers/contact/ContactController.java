package site.devesh.contactsync.controllers.contact;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import site.devesh.contactsync.request.ContactRequestDTO;
import site.devesh.contactsync.response.ContactResponseDTO;
import site.devesh.contactsync.services.ContactService;
import site.devesh.contactsync.services.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;
    private final UserService userService;

    @PostMapping("/add")
    public ResponseEntity<ContactResponseDTO> addContact(@RequestBody ContactRequestDTO contactRequestDTO){
        try {
            ContactResponseDTO response = contactService.createContact(contactRequestDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // You should at least log the error or return an appropriate error response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllContactsOfUser(){
        try{
            List<ContactResponseDTO> contactResponseDTOS = contactService.getContactByUser();
            return ResponseEntity.ok(contactResponseDTOS);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
