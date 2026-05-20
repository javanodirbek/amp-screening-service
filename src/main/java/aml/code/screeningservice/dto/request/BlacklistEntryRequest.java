package aml.code.screeningservice.dto.request;

import aml.code.screeningservice.entity.enums.ListType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BlacklistEntryRequest {
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 255, message = "Full name must be between 2 and 255 characters")
    private String  fullName;

    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate;

    @Size(max = 12, message = "INN must be at most 12 characters")
    private String inn;

    @Size(max = 50, message = "Passport number must be at most 50 characters")
    private String passportNumber;

    @NotNull(message = "List type is required")
    private ListType listType;


}
