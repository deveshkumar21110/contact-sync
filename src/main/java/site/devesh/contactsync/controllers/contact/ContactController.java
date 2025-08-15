package site.devesh.contactsync.controllers.contact;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import site.devesh.contactsync.model.ContactPreviewDTO;
import site.devesh.contactsync.model.LabelDTO;
import site.devesh.contactsync.request.ContactRequestDTO;
import site.devesh.contactsync.response.ContactResponseDTO;
import site.devesh.contactsync.services.ContactService;
import site.devesh.contactsync.services.UserService;

import java.util.List;
import java.util.Map;

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

    @GetMapping("/{contactId}")
    public ResponseEntity<?> getContactById(@PathVariable String contactId){
        try{
            ContactResponseDTO contactResponseDTO = contactService.getContactById(contactId);
            return ResponseEntity.ok(contactResponseDTO);
        } catch (Exception e){
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

    @GetMapping("/preview/all")
    public ResponseEntity<?> getAllContactsPreviewOfUser(){
        try{
            List<ContactPreviewDTO> contactPreviewDTOs = contactService.getContactPreviewByUser();
            return ResponseEntity.ok(contactPreviewDTOs);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateContact(
        @PathVariable String id,
        @RequestBody ContactRequestDTO contactRequestDTO
    ) {
        try {
            ContactResponseDTO responseDTO = contactService.updateContact(id, contactRequestDTO);
            return ResponseEntity.ok().body(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/label/update/{contactId}")
    public ResponseEntity<?> updateContactLabelOfCurrentUser(
        @PathVariable String contactId,
        @RequestBody List<LabelDTO> labelDTOs
    ) {
        try {
            ContactResponseDTO responseDTO = contactService.updateContactLabel(id, contactRequestDTO);
            return ResponseEntity.ok().body(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PatchMapping("/{contactId}/favourite")
    public ResponseEntity<?> toggleFavourite(
            @PathVariable String contactId,
            @RequestBody Map<String,Boolean> favouriteStatus

    ) {
        try {
            Boolean isFavourite = favouriteStatus.get("isFavourite");
            if(isFavourite == null) return ResponseEntity.badRequest().build();

            ContactResponseDTO updatedContact = contactService.updateFavouriteStatus(contactId,isFavourite);
            return ResponseEntity.ok().body(updatedContact);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

}
