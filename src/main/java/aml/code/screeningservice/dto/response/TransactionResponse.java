package aml.code.screeningservice.dto.response;

import aml.code.screeningservice.entity.enums.TransactionStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class TransactionResponse {
    private Long id;
    private Long clientId;
    private String clientName;           // Client'ning fullName'i
    private String recipientName;
    private String recipientPassport;
    private BigDecimal amount;
    private String currency;
    private TransactionStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String reviewedBy;
    private String reviewComment;
    private CheckResultResponse checkResult;
}
