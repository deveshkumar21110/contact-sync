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
import java.util.Objects;

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
import java.util.stream.Collectors;

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
        // Validate input
        if (id == null || id.trim().isEmpty()) {
            throw new RuntimeException("Contact ID cannot be null or empty");
        }

        log.info("=== DEBUG: Updating contact with ID: {} ===", id);

        // Get current user
        AppUserDto currentUserDto = userDetailsService.getCurrentUser();
        log.info("Current user DTO: {}", currentUserDto.getEmail());

        AppUser currentUser = userRepo.findByEmail(currentUserDto.getEmail());
        if (currentUser == null) {
            throw new RuntimeException("Current user not found");
        }

        log.info("Current user from DB: ID={}, Email={}", currentUser.getId(), currentUser.getEmail());

        // Step 1: Check if contact exists at all
        Optional<Contact> contactExists = contactRepo.findById(id);
        if (contactExists.isEmpty()) {
            log.error("Contact with ID {} does not exist in database", id);
            throw new RuntimeException("Contact not found with id: " + id);
        }

        Contact existingContact = contactExists.get();
        log.info("Contact found: ID={}, DisplayName={}, OwnerID={}, OwnerEmail={}",
                existingContact.getId(),
                existingContact.getDisplayName(),
                existingContact.getUser().getId(),
                existingContact.getUser().getEmail());

        // Step 2: Check ownership
        if (!existingContact.getUser().getId().equals(currentUser.getId())) {
            log.error("Ownership mismatch! Contact owner: {} (ID: {}), Current user: {} (ID: {})",
                    existingContact.getUser().getEmail(),
                    existingContact.getUser().getId(),
                    currentUser.getEmail(),
                    currentUser.getId());
            throw new RuntimeException("Unauthorized: Contact belongs to different user");
        }

        log.info("Ownership verified. Proceeding with update...");

        // Step 3: Try the combined query as fallback verification
        Optional<Contact> oldContactOpt = contactRepo.findByIdAndUser(id, currentUser);
        if (oldContactOpt.isEmpty()) {
            log.error("findByIdAndUser returned empty - there might be an issue with the custom query");
            // Use the contact we already found and verified
        }

        Contact oldContact = existingContact; // Use the verified contact

        // Update the contact
        contactMapper.updateContactFromDto(contactRequestDTO, oldContact);

        // Re-link child entities after mapping
        linkChildEntities(oldContact);

        // Handle labels separately
        handleLabels(oldContact, contactRequestDTO.getLabels());

        // Save and return
        Contact saved = contactRepo.save(oldContact);
        log.info("Contact successfully updated: {}", saved.getId());

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

    @Override
    @Transactional
    public ContactResponseDTO updateContactLabel(String id, List<LabelDTO> labelDTOs) {
        // 1. Find the contact
        Contact contact = contactRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + id));

        // 2. Verify the contact belongs to the current user
        AppUserDto currentUser = userDetailsService.getCurrentUser();
        if (!contact.getUser().getEmail().equals(currentUser.getEmail())) {
            throw new RuntimeException("Unauthorized to update labels for this contact");
        }

        // 3. Update labels
        handleLabels(contact, labelDTOs);

        // 4. Save changes
        Contact savedContact = contactRepo.save(contact);

        // 5. Convert back to DTO and return
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

    @Override
    @Transactional
    public void deleteContact(String contactId) {
        if (contactId == null || contactId.trim().isEmpty()) {
            throw new RuntimeException("Contact ID cannot be null or empty");
        }

        AppUser currentUser = getCurrentUserEntity();

        Contact contact = contactRepo.findByIdAndUser(contactId, currentUser)
                .orElseThrow(() -> new RuntimeException("Contact not found or unauthorized"));

        contactRepo.delete(contact); 

        log.info("Contact deleted successfully: {}", contactId);
    }

    @Override
    @Transactional
    public void deleteContactsByIds(List<String> contactIds) {
        // Validate input early
        if (contactIds == null || contactIds.isEmpty()) {
            throw new RuntimeException("Contact IDs list cannot be null or empty");
        }

        // Remove duplicates and null values
        List<String> cleanContactIds = contactIds.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(id -> !id.isEmpty())
                .distinct()
                .collect(Collectors.toList());

        if (cleanContactIds.isEmpty()) {
            throw new RuntimeException("No valid contact IDs provided");
        }

        // Get current user
        AppUser currentUser = getCurrentUserEntity();

        // Single optimized database operation with ownership check built-in
        int deletedCount = contactRepo.deleteByIdsAndUsers(cleanContactIds, currentUser);

        // Verify all contacts were deleted (optional - depends on your business logic)
        if (deletedCount != cleanContactIds.size()) {
            log.warn(
                    "Expected to delete {} contacts, but only deleted {}. Some contacts may not exist or belong to different user.",
                    cleanContactIds.size(), deletedCount);
        }

        log.info("Deleted {} contacts for user: {}", deletedCount, currentUser.getEmail());
    }

    @Override
    @Transactional
    public void deleteAllContactsForUser() {
        // Get current user
        AppUser currentUser = getCurrentUserEntity();

        // Single database operation
        int deletedCount = contactRepo.deleteByUser(currentUser);

        log.info("Deleted all {} contacts for user: {}", deletedCount, currentUser.getEmail());
    }

    private AppUser getCurrentUserEntity() {
        AppUserDto currentUserDto = userDetailsService.getCurrentUser();
        AppUser currentUser = userMapper.toAppUser(currentUserDto);
        if (currentUser == null) {
            throw new RuntimeException("Current user not found");
        }
        return currentUser;
    }
}
