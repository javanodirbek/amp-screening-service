package aml.code.screeningservice.service;

import aml.code.screeningservice.dto.request.BlacklistEntryRequest;
import aml.code.screeningservice.entity.BlacklistEntry;
import aml.code.screeningservice.entity.enums.EntryStatus;
import aml.code.screeningservice.mapper.BlackListMapper;
import aml.code.screeningservice.repository.BlacklistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BlacklistServiceTest {

    @Mock
    private BlacklistRepository blacklistRepository;

    @Mock
    private BlackListMapper blackListMapper;

    @InjectMocks
    private BlacklistService blacklistService;

    private BlacklistEntryRequest request;
    private BlacklistEntry entry;

    @BeforeEach
    void setUp() {
        request = new BlacklistEntryRequest();
        request.setFullName("Иванов Иван");
        request.setPassportNumber("AB1234567");

        entry = new BlacklistEntry();
        entry.setId(1L);
        entry.setFullName("Иванов Иван");
        entry.setStatus(EntryStatus.ACTIVE);
    }

    @Test
    void create_Success_StatusActive() {
        when(blackListMapper.toEntity(any())).thenReturn(entry);
        when(blacklistRepository.save(any(BlacklistEntry.class))).thenReturn(entry);

        blacklistService.create(request, "admin");

        verify(blacklistRepository).save(argThat(e ->
                e.getStatus() == EntryStatus.ACTIVE &&
                        e.getAddedBy().equals("admin") &&
                        e.getAddedAt() != null
        ));
    }

    @Test
    void delete_Success_StatusInactive() {
        when(blacklistRepository.findById(1L)).thenReturn(Optional.of(entry));
        when(blacklistRepository.save(any(BlacklistEntry.class))).thenReturn(entry);

        blacklistService.delete(1L);

        verify(blacklistRepository).save(argThat(e ->
                e.getStatus() == EntryStatus.INACTIVE
        ));
        verify(blacklistRepository, never()).delete(any());
    }
}
