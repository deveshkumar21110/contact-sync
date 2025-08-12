package site.devesh.contactsync.services.impl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import site.devesh.contactsync.entities.AppUser;
import site.devesh.contactsync.entities.Contact;
import site.devesh.contactsync.mapper.ContactMapper;
import site.devesh.contactsync.mapper.UserMapper;
import site.devesh.contactsync.model.AppUserDto;
import site.devesh.contactsync.model.ContactPreviewDTO;
import site.devesh.contactsync.model.LabelDTO;
import site.devesh.contactsync.repo.ContactRepo;
import site.devesh.contactsync.repo.LabelRepo;
import site.devesh.contactsync.repo.UserRepo;
import site.devesh.contactsync.request.ContactRequestDTO;
import site.devesh.contactsync.response.ContactResponseDTO;
import site.devesh.contactsync.services.ContactService;

import java.util.ArrayList;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import site.devesh.contactsync.entities.AppUser;
import site.devesh.contactsync.entities.Contact;
import site.devesh.contactsync.entities.Label;
import site.devesh.contactsync.mapper.ContactMapper;
import site.devesh.contactsync.mapper.UserMapper;
import site.devesh.contactsync.model.AppUserDto;
import site.devesh.contactsync.model.ContactPreviewDTO;
import site.devesh.contactsync.model.LabelDTO;
import site.devesh.contactsync.repo.ContactRepo;
import site.devesh.contactsync.repo.LabelRepo;
import site.devesh.contactsync.repo.UserRepo;
import site.devesh.contactsync.request.ContactRequestDTO;
import site.devesh.contactsync.response.ContactResponseDTO;
import site.devesh.contactsync.services.ContactService;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactRepo contactRepo;
    private final ContactMapper contactMapper;
    private final UserMapper userMapper;
    private final UserDetailsServiceImpl userDetailsService;
    private final UserRepo userRepo;
    private final LabelRepo labelRepo;

    @Override
    public ContactResponseDTO createContact(ContactRequestDTO contactRequestDTO) {
        AppUserDto user = userDetailsService.getCurrentUser();

        Contact contact = contactMapper.toContact(contactRequestDTO);

        // contact.setId(UUID.randomUUID().toString());
        String firstName = contact.getFirstName() != null ? contact.getFirstName().trim() : "";
        String lastName = contact.getLastName() != null ? contact.getLastName().trim() : "";
        contact.setDisplayName((firstName + " " + lastName).trim());
        AppUser managedUser = userRepo.findByEmail(user.getEmail());
        if (managedUser == null) {
            throw new RuntimeException("User not found");
        }
        contact.setUser(managedUser);
        linkChildEntities(contact);
        handleLabels(contact, contactRequestDTO.getLabels());

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
        try {
            AppUser user = userMapper.toAppUser(userDetailsService.getCurrentUser());
            List<Contact> contacts = contactRepo.findContactsWithAllData(user);
            return contactMapper.toContactResponseDTOList(contacts);
        } catch (Exception e) {
            log.error("Error fetching contacts for user: ", e);
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactPreviewDTO> getContactPreviewByUser() {
        String currentUserId = userDetailsService.getCurrentUser().getId();

        // Execute all queries - Hibernate will merge them automatically
        contactRepo.findContactsWithPhones(currentUserId);
        List<Contact> contacts = contactRepo.findContactsWithEmails(currentUserId);

        return contactMapper.toContactPreviewDTOList(contacts);
    }

    @Override
    public ContactResponseDTO getContactById(String id) {
        Contact contact = contactRepo.getContactById(id);
        return contactMapper.toContactResponseDTO(contact);
    }

    @Override
    @Transactional
    public ContactResponseDTO updateContact(String id, ContactRequestDTO contactRequestDTO) {
        Contact oldContact = contactRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("contact not found with id: " + id));
        contactMapper.updateContactFromDto(contactRequestDTO, oldContact);
        // Handle labels separately
        handleLabels(oldContact, contactRequestDTO.getLabels());
        Contact saved = contactRepo.save(oldContact);
        return contactMapper.toContactResponseDTO(saved);
    }

    @Override
    @Transactional
    public ContactResponseDTO updateFavouriteStatus(String id, Boolean isFavourite) {
        Contact contact = contactRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + id));

        // Verify ownership
        AppUserDto currentUser = userDetailsService.getCurrentUser();
        if (!contact.getUser().getEmail().equals(currentUser.getEmail())) {
            throw new RuntimeException("Unauthorized to update this contact");
        }

        contact.setIsFavourite(isFavourite);
        Contact savedContact = contactRepo.save(contact);
        return contactMapper.toContactResponseDTO(savedContact);
    }

    private void handleLabels(Contact contact, List<LabelDTO> labelDTOs) {
        if (labelDTOs == null || labelDTOs.isEmpty()) {
            contact.setLabels(new ArrayList<>());
            return;
        }

        // Get current user
        AppUserDto currentUserDto = userDetailsService.getCurrentUser();
        AppUser currentUser = userRepo.findByEmail(currentUserDto.getEmail());
        if (currentUser == null) {
            throw new RuntimeException("Current user not found");
        }

        List<Label> labels = new ArrayList<>();

        for (LabelDTO labelDTO : labelDTOs) {
            Label label = null;

            // If label has an ID, try to find existing label belonging to current user
            if (labelDTO.getId() != null) {
                Optional<Label> existingLabel = labelRepo.findById(labelDTO.getId());
                if (existingLabel.isPresent() &&
                        existingLabel.get().getAppUser() != null &&
                        existingLabel.get().getAppUser().equals(currentUser)) {
                    label = existingLabel.get();
                }
            }

            // If no existing label found by ID, try to find by name for current user
            if (label == null && labelDTO.getName() != null && !labelDTO.getName().trim().isEmpty()) {
                label = labelRepo.findByNameAndAppUser(labelDTO.getName().trim(), currentUser);
            }

            // If still no label found, create a new one for current user
            if (label == null && labelDTO.getName() != null && !labelDTO.getName().trim().isEmpty()) {
                label = new Label();
                label.setName(labelDTO.getName().trim());
                label.setAppUser(currentUser); // Link to current user
                label = labelRepo.save(label); // saving new label
            }

            if (label != null) {
                labels.add(label);
            }
        }

        contact.setLabels(labels);
    }

}
