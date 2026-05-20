package aml.code.screeningservice.service;

import aml.code.screeningservice.entity.BlacklistEntry;
import aml.code.screeningservice.entity.CheckResult;
import aml.code.screeningservice.entity.Transaction;
import aml.code.screeningservice.entity.enums.EntryStatus;
import aml.code.screeningservice.entity.enums.MatchResult;
import aml.code.screeningservice.entity.enums.TransactionStatus;
import aml.code.screeningservice.repository.BlacklistRepository;
import aml.code.screeningservice.repository.CheckResultRepository;
import aml.code.screeningservice.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ScreeningServiceTest {

    @Mock
    private BlacklistRepository blacklistRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CheckResultRepository checkResultRepository;

    @InjectMocks
    private ScreeningService screeningService;

    private Transaction transaction;
    private BlacklistEntry blacklistEntry;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(screeningService, "threshold", 0.80);

        transaction = new Transaction();
        transaction.setId(1L);
        transaction.setRecipientName("Иванов Иван Иванович");
        transaction.setStatus(TransactionStatus.PENDING);

        blacklistEntry = new BlacklistEntry();
        blacklistEntry.setId(1L);
        blacklistEntry.setFullName("Иванов Иван Иванович");
        blacklistEntry.setStatus(EntryStatus.ACTIVE);
    }

    @Test
    void screen_HIT_WhenMatchFound() {
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);
        when(blacklistRepository.findActiveByNameContaining(eq(EntryStatus.ACTIVE), anyString()))
                .thenReturn(List.of(blacklistEntry));
        when(checkResultRepository.save(any(CheckResult.class))).thenReturn(new CheckResult());

        screeningService.screen(transaction);

        verify(transactionRepository, times(2)).save(argThat(t ->
                t.getStatus() == TransactionStatus.BLOCKED_AUTO
        ));
        verify(checkResultRepository).save(argThat(cr ->
                cr.getResult() == MatchResult.HIT && cr.getMatchScore() >= 0.80
        ));
    }

    @Test
    void screen_CLEAR_WhenNoMatch() {
        transaction.setRecipientName("Смирнов Алексей");

        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);
        when(blacklistRepository.findActiveByNameContaining(eq(EntryStatus.ACTIVE), anyString()))
                .thenReturn(List.of(blacklistEntry));
        when(checkResultRepository.save(any(CheckResult.class))).thenReturn(new CheckResult());

        screeningService.screen(transaction);

        verify(transactionRepository, times(2)).save(argThat(t ->
                t.getStatus() == TransactionStatus.CLEAR
        ));
        verify(checkResultRepository).save(argThat(cr ->
                cr.getResult() == MatchResult.CLEAR
        ));
    }

    @Test
    void screen_CLEAR_WhenBlacklistEmpty() {
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);
        when(blacklistRepository.findActiveByNameContaining(eq(EntryStatus.ACTIVE), anyString()))
                .thenReturn(Collections.emptyList());
        when(checkResultRepository.save(any(CheckResult.class))).thenReturn(new CheckResult());

        screeningService.screen(transaction);

        verify(transactionRepository, times(2)).save(argThat(t ->
                t.getStatus() == TransactionStatus.CLEAR
        ));
        verify(checkResultRepository).save(argThat(cr ->
                cr.getResult() == MatchResult.CLEAR && cr.getMatchScore() == 0.0
        ));
    }
}
