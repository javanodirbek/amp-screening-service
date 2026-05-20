package aml.code.screeningservice.service;

import aml.code.screeningservice.entity.Transaction;
import aml.code.screeningservice.entity.enums.TransactionStatus;
import aml.code.screeningservice.exception.InvalidStatusTransitionException;
import aml.code.screeningservice.exception.ResourceNotFoundException;
import aml.code.screeningservice.mapper.TransactionMapper;
import aml.code.screeningservice.repository.TransactionRepository;
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
class ReviewServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private TransactionMapper transactionMapper;

    @InjectMocks
    private ReviewService reviewService;

    private Transaction transaction;

    @BeforeEach
    void setUp() {
        transaction = new Transaction();
        transaction.setId(1L);
    }

    @Test
    void approve_Success_WhenStatusUnderReview() {
        transaction.setStatus(TransactionStatus.UNDER_REVIEW);

        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);

        reviewService.approve(1L, "OK", "officer1");

        verify(transactionRepository).save(argThat(t ->
                t.getStatus() == TransactionStatus.APPROVED &&
                        t.getReviewedBy().equals("officer1")
        ));
    }

    @Test
    void approve_ThrowsException_WhenStatusNotUnderReview() {
        transaction.setStatus(TransactionStatus.PENDING);

        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));

        assertThrows(InvalidStatusTransitionException.class, () ->
                reviewService.approve(1L, "OK", "officer1")
        );

        verify(transactionRepository, never()).save(any());
    }

    @Test
    void reject_Success_WhenStatusUnderReview() {
        transaction.setStatus(TransactionStatus.UNDER_REVIEW);

        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);

        reviewService.reject(1L, "Rejected", "officer1");

        verify(transactionRepository).save(argThat(t ->
                t.getStatus() == TransactionStatus.REJECTED &&
                        t.getReviewedBy().equals("officer1")
        ));
    }

    @Test
    void submitForReview_Success_WhenStatusBlockedAuto() {
        transaction.setStatus(TransactionStatus.BLOCKED_AUTO);

        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);

        reviewService.submitForReview(1L);

        verify(transactionRepository).save(argThat(t ->
                t.getStatus() == TransactionStatus.UNDER_REVIEW
        ));
    }

    @Test
    void submitForReview_ThrowsException_WhenStatusNotBlockedAuto() {
        transaction.setStatus(TransactionStatus.CLEAR);

        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));

        assertThrows(InvalidStatusTransitionException.class, () ->
                reviewService.submitForReview(1L)
        );
    }
}
