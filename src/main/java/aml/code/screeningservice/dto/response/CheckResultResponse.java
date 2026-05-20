package aml.code.screeningservice.dto.response;

import aml.code.screeningservice.entity.enums.MatchResult;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CheckResultResponse {
    private Long id;
    private String result;        // HIT yoki CLEAR
    private Double matchScore;
    private Double threshold;
    private String algorithm;
    private String checkDate;
    private Long matchedEntryId;  // Agar HIT bo'lsa
    private String matchedEntryName;
}
