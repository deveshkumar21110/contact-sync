package site.devesh.contactsync.services;

import java.util.List;

import org.springframework.stereotype.Service;

import site.devesh.contactsync.model.LabelDTO;

@Service
public interface LabelService {

    LabelDTO createLabel(LabelDTO labelRequestDTO);

    List<LabelDTO> getAllLabelsOfCurrentUser();
}
