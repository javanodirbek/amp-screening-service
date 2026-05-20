package aml.code.screeningservice.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ClientRequest {
    @NotBlank(message = "Full name is required")
    @Size(min = 3, max = 255, message = "Full name must be between 3 and 255 characters")
    private String fullName;

    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate;

    @Size(max = 50, message = "Passport number must be at most 50 characters")
    private String passportNumber;  // ← QO'SHILDI

    @Size(max = 12, message = "INN must be at most 12 characters")
    private String inn;  // ← QO'SHILDI

    @Pattern(
            regexp = "^\\+?[0-9]{7,15}$",
            message = "Invalid phone number format"
    )
    private String phone;

    @Email(message = "Email should be valid")
    private String email;
}
