package site.devesh.contactsync.controllers.contact;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import site.devesh.contactsync.model.LabelDTO;
import site.devesh.contactsync.repo.LabelRepo;
import site.devesh.contactsync.services.LabelService;

@RestController
@RequestMapping("/api/v1/label")
@RequiredArgsConstructor
public class LabelController {
    
    private final LabelService labelService;
    private final LabelRepo labelRepo;

    @GetMapping("/all")
    public ResponseEntity<?> getAllLabelsOfCurrentUser(){
        try {
            List<LabelDTO> labelDTOs = labelService.getAllLabelsOfCurrentUser();
            return ResponseEntity.ok(labelDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addLabel(@RequestBody LabelDTO labelDTO){

        try {
            if(labelDTO != null && !labelDTO.getName().isEmpty()){
                LabelDTO newLabel = labelService.createLabel(labelDTO);
                return ResponseEntity.ok().body(newLabel);
            }
            else{
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        
    }

}
