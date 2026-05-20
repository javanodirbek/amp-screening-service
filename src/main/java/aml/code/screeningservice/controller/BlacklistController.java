package aml.code.screeningservice.controller;

import aml.code.screeningservice.dto.request.BlacklistEntryRequest;
import aml.code.screeningservice.entity.enums.EntryStatus;
import aml.code.screeningservice.entity.enums.ListType;
import aml.code.screeningservice.service.BlacklistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/blacklist")
@RequiredArgsConstructor
public class BlacklistController {

    private final BlacklistService blacklistService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody @Valid BlacklistEntryRequest request,
                                    @AuthenticationPrincipal(errorOnInvalidType = false) UserDetails userDetails) {
        return ResponseEntity.ok(blacklistService.create(request, userDetails.getUsername()));
    }

    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR', 'COMPLIANCE_OFFICER')")
    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) EntryStatus status,
                                    @RequestParam(required = false) ListType listType,
                                    @RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "10") int size,
                                    Pageable pageable) {
            return ResponseEntity.ok(blacklistService.getAll(status, listType, pageable));
    }

    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR', 'COMPLIANCE_OFFICER')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById (@PathVariable Long id){
        return ResponseEntity.ok(blacklistService.getById(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'COMPLIANCE_OFFICER')")
    @PatchMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody BlacklistEntryRequest request) {
        return ResponseEntity.ok(blacklistService.update(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return ResponseEntity.ok(blacklistService.delete(id));
    }
}
