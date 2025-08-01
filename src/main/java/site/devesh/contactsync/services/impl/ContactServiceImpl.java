package site.devesh.contactsync.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import site.devesh.contactsync.entities.AppUser;
import site.devesh.contactsync.entities.Contact;
import site.devesh.contactsync.mapper.ContactMapper;
import site.devesh.contactsync.mapper.UserMapper;
import site.devesh.contactsync.model.AppUserDto;
import site.devesh.contactsync.repo.ContactRepo;
import site.devesh.contactsync.repo.UserRepo;
import site.devesh.contactsync.request.ContactRequestDTO;
import site.devesh.contactsync.response.ContactResponseDTO;
import site.devesh.contactsync.services.ContactService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactRepo contactRepo;
    private final ContactMapper contactMapper;
    private final UserMapper userMapper;
    private final UserDetailsServiceImpl userDetailsService;
    private final UserRepo userRepo;

    @Override
    public ContactResponseDTO createContact(ContactRequestDTO contactRequestDTO) {
        AppUserDto  user = userDetailsService.getCurrentUser();

        Contact contact = contactMapper.toContact(contactRequestDTO);

//        contact.setId(UUID.randomUUID().toString());
        String firstName = contact.getFirstName() != null ? contact.getFirstName().trim() : "";
        String lastName = contact.getLastName() != null ? contact.getLastName().trim() : "";
        contact.setDisplayName((firstName + " " + lastName).trim());
        AppUser managedUser = userRepo.findByEmail(user.getEmail());
        if (managedUser == null) {
            throw new RuntimeException("User not found");
        }
        contact.setUser(managedUser);
        linkChildEntities(contact);

        Contact savedContact = contactRepo.save(contact);
        return contactMapper.toContactResponseDTO(savedContact);
    }


    private void linkChildEntities(Contact contact) {
        if (contact.getPhoneNumbers() != null) {
            contact.getPhoneNumbers().forEach(p -> p.setContact(contact));
        }
        if (contact.getEmails() != null) {
            contact.getEmails().forEach(e -> e.setContact(contact));
        }
        if (contact.getAddresses() != null) {
            contact.getAddresses().forEach(a -> a.setContact(contact));
        }
        if (contact.getWebsites() != null) {
            contact.getWebsites().forEach(w -> w.setContact(contact));
        }
        if (contact.getSignificantDates() != null) {
            contact.getSignificantDates().forEach(s -> s.setContact(contact));
        }
    }




    @Override
    public List<ContactResponseDTO> getContactByUser() {
        AppUser user = userMapper.toAppUser(userDetailsService.getCurrentUser());
        return contactMapper.toContactResponseDTOList(contactRepo.findContactByUser(user));
    }
    
    @Override
    public ContactResponseDTO getContactById(String id) {
        Contact contact = contactRepo.getContactById(id);
        return contactMapper.toContactResponseDTO(contact);
    }

    @Override
    @Transactional
    public ContactResponseDTO updateContact(String id,ContactRequestDTO contactRequestDTO){
        Contact oldContact = contactRepo.findById(id).orElseThrow(() -> new RuntimeException("contact not found with id: "+id));
        contactMapper.updateContactFromDto(contactRequestDTO, oldContact);
        Contact saved = contactRepo.save(oldContact);
        return contactMapper.toContactResponseDTO(saved);
    }
    

}
