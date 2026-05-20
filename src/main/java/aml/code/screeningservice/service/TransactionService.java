package aml.code.screeningservice.service;


import aml.code.screeningservice.dto.request.TransactionRequest;
import aml.code.screeningservice.dto.response.TransactionResponse;
import aml.code.screeningservice.entity.Client;
import aml.code.screeningservice.entity.Transaction;
import aml.code.screeningservice.entity.enums.TransactionStatus;
import aml.code.screeningservice.exception.ResourceNotFoundException;
import aml.code.screeningservice.exception.UserNotFoundException;
import aml.code.screeningservice.mapper.TransactionMapper;
import aml.code.screeningservice.repository.ClientRepository;
import aml.code.screeningservice.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;
    private final ClientRepository clientRepository;
    private final ScreeningService screeningService;

    public Long createTransaction(TransactionRequest request) {
        log.info("Creating transaction for client ID: {}, amount: {}",
                request.getClientId(), request.getAmount());

        Client client = clientRepository.findById(request.getClientId()).orElseThrow(
                () -> {
                    log.error("Client not found: {}", request.getClientId());
                    return new ResourceNotFoundException("client.not.found");
                }
        );

        Transaction transaction = transactionMapper.toEntity(request);
        transaction.setClient(client);
        transaction.setStatus(TransactionStatus.PENDING);
        transaction.setCreatedAt(LocalDateTime.now());

        Transaction savedTransaction = transactionRepository.save(transaction);

        log.info("Transaction created with ID: {}", savedTransaction.getId());
        screeningService.screen(savedTransaction);

        Transaction updatedTransaction = transactionRepository.findById(savedTransaction.getId())
                .orElseThrow(() -> new ResourceNotFoundException("transaction.not.found"));
        log.info("Transaction {} final status: {}",
                updatedTransaction.getId(), updatedTransaction.getStatus());
        return updatedTransaction.getId();
    }

    public Page<TransactionResponse> getAllTransactions(TransactionStatus status, Pageable pageable) {
        Page<Transaction> allByStatus;
        if (status != null) {
            allByStatus = transactionRepository.findAllByStatus(status, pageable);
        } else {
            allByStatus = transactionRepository.findAll(pageable);
        }
        return allByStatus.map(transactionMapper::toResponse);
    }

    public TransactionResponse getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("transaction.not.found")
        );
        return transactionMapper.toResponse(transaction);
    }
}
