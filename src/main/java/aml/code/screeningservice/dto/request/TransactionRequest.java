package aml.code.screeningservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NonNull;

import java.math.BigDecimal;

@Data
public class TransactionRequest {
    @NonNull
    private Long clientId;
    @NotBlank
    @Size(min = 2, max = 255)
    private String recipientName;
    @Size(min = 4, max = 50, message = "Passport number must be between 4 and 50 characters")
    private String recipientPassport;
    @NonNull
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotBlank
    @Pattern(regexp = "^[A-Z]{3}$", message = "Currency must be a three-upper case letters")
    private String currency;
}
