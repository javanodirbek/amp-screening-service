package aml.code.screeningservice.controller;

import aml.code.screeningservice.dto.request.TransactionRequest;
import aml.code.screeningservice.entity.enums.EntryStatus;
import aml.code.screeningservice.entity.enums.TransactionStatus;
import aml.code.screeningservice.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody @Valid TransactionRequest request) {
        return ResponseEntity.ok(transactionService.createTransaction(request));
    }

    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR', 'COMPLIANCE_OFFICER')")
    @GetMapping
    public ResponseEntity<?> getAllTransactions(@RequestParam(required = false) TransactionStatus status,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "10") int size,
                                                Pageable pageable) {
        return ResponseEntity.ok(transactionService.getAllTransactions(status, pageable));
    }

    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR', 'COMPLIANCE_OFFICER')")
    @GetMapping("{id}")
    public ResponseEntity<?> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }
}
