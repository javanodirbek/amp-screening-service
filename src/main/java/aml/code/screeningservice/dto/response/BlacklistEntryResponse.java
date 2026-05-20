package aml.code.screeningservice.dto.response;

import aml.code.screeningservice.entity.enums.EntryStatus;
import aml.code.screeningservice.entity.enums.ListType;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BlacklistEntryResponse {
    private Long id;
    private String fullName;
    private LocalDate birthDate;
    private String passportNumber;
    private String inn;
    private ListType listType;
    private EntryStatus status;
    private LocalDateTime addedAt;
    private LocalDateTime updatedAt;
    private String addedBy;
}
