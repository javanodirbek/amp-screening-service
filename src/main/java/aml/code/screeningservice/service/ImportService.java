package aml.code.screeningservice.service;

import aml.code.screeningservice.dto.request.BlacklistEntryRequest;
import aml.code.screeningservice.dto.response.ImportResultResponse;
import aml.code.screeningservice.entity.BlacklistEntry;
import aml.code.screeningservice.entity.enums.EntryStatus;
import aml.code.screeningservice.mapper.BlackListMapper;
import aml.code.screeningservice.repository.BlacklistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImportService {

    private final BlacklistRepository blacklistRepository;
    private final BlackListMapper blackListMapper;

    public ImportResultResponse importFromList(
            List<BlacklistEntryRequest> entries,
            String addedBy) {

        int imported = 0;
        int skipped = 0;
        int errors = 0;
        List<String> errorMessages = new ArrayList<>();

        for (int i = 0; i < entries.size(); i++) {
            BlacklistEntryRequest request = entries.get(i);

            try {
                // Tekshirish: allaqachon bormi?
                if (request.getPassportNumber() != null &&
                        blacklistRepository.existsByPassportNumber(request.getPassportNumber())) {
                    skipped++;
                    log.debug("Entry {} skipped: passport already exists", i);
                    continue;
                }

                // Saqlash
                BlacklistEntry entry = blackListMapper.toEntity(request);
                entry.setStatus(EntryStatus.ACTIVE);
                entry.setAddedAt(LocalDateTime.now());
                entry.setAddedBy(addedBy);
                blacklistRepository.save(entry);

                imported++;
                log.debug("Entry {} imported successfully", i);

            } catch (Exception e) {
                errors++;
                String errorMsg = String.format("Entry %d: %s", i, e.getMessage());
                errorMessages.add(errorMsg);
                log.error("Error importing entry {}: {}", i, e.getMessage());
            }
        }

        log.info("Import completed: imported={}, skipped={}, errors={}",
                imported, skipped, errors);

        return ImportResultResponse.builder()
                .imported(imported)
                .skipped(skipped)
                .errors(errors)
                .errorMessages(errorMessages)
                .build();
    }
}
