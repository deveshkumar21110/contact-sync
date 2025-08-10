package site.devesh.contactsync.services.impl;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import site.devesh.contactsync.entities.AppUser;
import site.devesh.contactsync.entities.Label;
import site.devesh.contactsync.model.LabelDTO;
import site.devesh.contactsync.repo.LabelRepo;
import site.devesh.contactsync.services.LabelService;
import site.devesh.contactsync.mapper.LabelMapper;
import site.devesh.contactsync.mapper.UserMapper;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LabelServiceImpl implements LabelService {

    private final LabelRepo labelRepo;
    private final LabelMapper labelMapper;
    private final UserMapper userMapper;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    public LabelDTO createLabel(LabelDTO labelDTO) {
        if (labelDTO == null || labelDTO.getName() == null || labelDTO.getName().isEmpty()) {
            throw new IllegalArgumentException("Label name cannot be null or empty");
        }

        Label newLabel = labelMapper.toEntity(labelDTO);
        Label savedLabel = labelRepo.save(newLabel);

        return labelMapper.toDto(savedLabel);
    }

    @Override
    public List<LabelDTO> getAllLabelsOfCurrentUser() {
        AppUser user = userMapper.toAppUser(userDetailsService.getCurrentUser());
        return labelMapper.toDtoList(labelRepo.findByAppUser(user));
    }

}
