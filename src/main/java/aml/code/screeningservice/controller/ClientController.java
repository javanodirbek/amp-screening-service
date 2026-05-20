package aml.code.screeningservice.controller;


import aml.code.screeningservice.dto.request.ClientRequest;
import aml.code.screeningservice.service.ClientService;
import aml.code.screeningservice.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;
    private final TransactionService transactionService;

    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
    @PostMapping
    public ResponseEntity<?> createClient(@RequestBody @Valid ClientRequest request) {
        return ResponseEntity.ok(clientService.create(request));
    }

    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR', 'COMPLIANCE_OFFICER')")
    @GetMapping
    public ResponseEntity<?> getAllClients() {
        return ResponseEntity.ok(clientService.getAll());
    }

    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR', 'COMPLIANCE_OFFICER')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getClientById(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.getById(id));
    }
}
