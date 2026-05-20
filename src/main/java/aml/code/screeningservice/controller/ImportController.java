package aml.code.screeningservice.controller;

import aml.code.screeningservice.dto.request.BulkImportRequest;
import aml.code.screeningservice.dto.response.ImportResultResponse;
import aml.code.screeningservice.service.ImportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/blacklist")
@RequiredArgsConstructor
public class ImportController {

    private final ImportService importService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/import")
    public ResponseEntity<ImportResultResponse> bulkImport(
            @RequestBody @Valid BulkImportRequest request,
            @AuthenticationPrincipal(errorOnInvalidType = false) UserDetails userDetails) {

        log.info("Bulk import request by: {}", userDetails.getUsername());

        ImportResultResponse result = importService.importFromList(
                request.getEntries(),
                userDetails.getUsername()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
}

