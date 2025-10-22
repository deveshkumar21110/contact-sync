package site.devesh.contactsync.services;

import org.springframework.stereotype.Service;

import site.devesh.contactsync.model.ContactPreviewDTO;
import site.devesh.contactsync.model.LabelDTO;
import site.devesh.contactsync.request.ContactRequestDTO;
import site.devesh.contactsync.response.ContactResponseDTO;

import java.util.List;

@Service
public interface ContactService {

    ContactResponseDTO createContact(ContactRequestDTO contactRequestDTO);

    List<ContactResponseDTO> getContactByUser();

    List<ContactPreviewDTO> getContactPreviewByUser();

    ContactResponseDTO updateContact(String id, ContactRequestDTO contactRequestDTO);

    ContactResponseDTO getContactById(String id);

    ContactResponseDTO updateFavouriteStatus(String id, Boolean isFavourite);

    ContactResponseDTO updateContactLabel(String id, List<LabelDTO> labelDTOs);

    void deleteContact(String contactId);

    void deleteAllContactsForUser();

    void deleteContactsByIds(List<String> contactIds);

    ContactResponseDTO moveToTrash(String id);

    ContactResponseDTO restoreContact(String id);

    void deleteOldTrashedContacts() ;
}
