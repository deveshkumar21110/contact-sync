package site.devesh.contactsync.services;

import org.springframework.stereotype.Service;
import site.devesh.contactsync.request.ContactRequestDTO;
import site.devesh.contactsync.response.ContactResponseDTO;

import java.util.List;

@Service
public interface ContactService {

    ContactResponseDTO createContact(ContactRequestDTO contactRequestDTO);

    List<ContactResponseDTO> getContactByUser();

    ContactResponseDTO updateContact(String id, ContactRequestDTO contactRequestDTO);

    ContactResponseDTO getContactById(String id);
}
