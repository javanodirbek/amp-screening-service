package aml.code.screeningservice.service;

import aml.code.screeningservice.dto.request.BlacklistEntryRequest;
import aml.code.screeningservice.dto.response.ImportResultResponse;
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

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ImportServiceTest {

    @Mock
    private BlacklistRepository blacklistRepository;

    @Mock
    private BlackListMapper blackListMapper;

    @InjectMocks
    private ImportService importService;

    private List<BlacklistEntryRequest> requests;

    @BeforeEach
    void setUp() {
        requests = new ArrayList<>();
    }

    @Test
    void importFromList_Success_AllImported() {
        for (int i = 0; i < 10; i++) {
            BlacklistEntryRequest req = new BlacklistEntryRequest();
            req.setFullName("Person " + i);
            req.setPassportNumber("AB" + i);
            requests.add(req);
        }

        when(blacklistRepository.existsByPassportNumber(anyString())).thenReturn(false);
        when(blackListMapper.toEntity(any())).thenReturn(new BlacklistEntry());
        when(blacklistRepository.save(any())).thenReturn(new BlacklistEntry());

        ImportResultResponse result = importService.importFromList(requests, "admin");

        assertEquals(10, result.getImported());
        assertEquals(0, result.getSkipped());
        assertEquals(0, result.getErrors());
        verify(blacklistRepository, times(10)).save(any());
    }

    @Test
    void importFromList_SkipDuplicates() {
        for (int i = 0; i < 8; i++) {
            BlacklistEntryRequest req = new BlacklistEntryRequest();
            req.setFullName("Person " + i);
            req.setPassportNumber("AB" + i);
            requests.add(req);
        }

        when(blacklistRepository.existsByPassportNumber(anyString()))
                .thenReturn(false, false, false, true, true, true, false, false);
        when(blackListMapper.toEntity(any())).thenReturn(new BlacklistEntry());
        when(blacklistRepository.save(any())).thenReturn(new BlacklistEntry());

        ImportResultResponse result = importService.importFromList(requests, "admin");

        assertEquals(5, result.getImported());
        assertEquals(3, result.getSkipped());
        assertEquals(0, result.getErrors());
    }

    @Test
    void importFromList_WithErrors() {
        for (int i = 0; i < 5; i++) {
            BlacklistEntryRequest req = new BlacklistEntryRequest();
            req.setFullName("Person " + i);
            req.setPassportNumber("AB" + i);
            requests.add(req);
        }

        when(blacklistRepository.existsByPassportNumber(anyString())).thenReturn(false);
        when(blackListMapper.toEntity(any())).thenReturn(new BlacklistEntry());
        when(blacklistRepository.save(any()))
                .thenReturn(new BlacklistEntry())
                .thenThrow(new RuntimeException("DB error"))
                .thenReturn(new BlacklistEntry())
                .thenReturn(new BlacklistEntry())
                .thenReturn(new BlacklistEntry());

        ImportResultResponse result = importService.importFromList(requests, "admin");

        assertEquals(4, result.getImported());
        assertEquals(0, result.getSkipped());
        assertEquals(1, result.getErrors());
        assertFalse(result.getErrorMessages().isEmpty());
    }
}
