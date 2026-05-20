package aml.code.screeningservice.service;

import aml.code.screeningservice.dto.request.BlacklistEntryRequest;
import aml.code.screeningservice.dto.response.BlacklistEntryResponse;
import aml.code.screeningservice.entity.BlacklistEntry;
import aml.code.screeningservice.entity.enums.EntryStatus;
import aml.code.screeningservice.entity.enums.ListType;
import aml.code.screeningservice.exception.DuplicateResourceException;
import aml.code.screeningservice.exception.InvalidInputException;
import aml.code.screeningservice.exception.InvalidStatusTransitionException;
import aml.code.screeningservice.exception.ResourceNotFoundException;
import aml.code.screeningservice.mapper.BlackListMapper;
import aml.code.screeningservice.repository.BlacklistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class BlacklistService {

    private final BlacklistRepository blacklistRepository;
    private final BlackListMapper blackListMapper;
    private static final String EXCEPTION_MESSAGE = "black.list.not.found";

    public Long create(BlacklistEntryRequest request, String addedBy) {
        log.info("Creating blacklist entry: {} by {}", request.getFullName(), addedBy);
        BlacklistEntry entry = blackListMapper.toEntity(request);
        if (blacklistRepository.existsByPassportNumber((request.getPassportNumber()))) {
            log.warn("Duplicate passport number: {}", request.getPassportNumber());
            throw new DuplicateResourceException("passport.already.exists");
        }
        entry.setStatus(EntryStatus.ACTIVE);
        entry.setAddedAt(LocalDateTime.now());
        if (addedBy == null) {
          throw new InvalidInputException("addedBy.cannot.be.null");
        }
        entry.setAddedBy(addedBy);
        log.info("Blacklist entry created with ID: {}", entry.getId());
        return blacklistRepository.save(entry).getId();
    }

    public Page<BlacklistEntryResponse> getAll(EntryStatus status, ListType listType, Pageable pageable) {
        Page<BlacklistEntry> entries;
        if (status != null && listType != null) {
            entries = blacklistRepository.findByStatusAndListType(status, listType, pageable);
        } else if (status != null) {
            entries = blacklistRepository.findByStatus(status, pageable);
        } else if (listType != null) {
            entries = blacklistRepository.findByListType(listType, pageable);
        } else {
            entries = blacklistRepository.findAll(pageable);
        }
        return entries.map(blackListMapper::toResponse);
    }

    public BlacklistEntryResponse getById(Long id) {
        BlacklistEntry entry = blacklistRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException(EXCEPTION_MESSAGE)
        );
        return blackListMapper.toResponse(entry);
    }

    public Boolean update(Long id, BlacklistEntryRequest request) {
        BlacklistEntry entry = blacklistRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException(EXCEPTION_MESSAGE)
        );
        blackListMapper.updateFromRequest(request, entry);
        entry.setUpdatedAt(LocalDateTime.now());
        blacklistRepository.save(entry);
        return true;
    }

    public Boolean delete(Long id) {
        BlacklistEntry entry = blacklistRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException(EXCEPTION_MESSAGE)
        );
        if (entry.getStatus() == EntryStatus.INACTIVE) {
            throw new InvalidStatusTransitionException("entry.already.deleted");
        }else {
            entry.setStatus(EntryStatus.INACTIVE);
            entry.setUpdatedAt(LocalDateTime.now());
            blacklistRepository.save(entry);

        }
        return true;
    }
}
