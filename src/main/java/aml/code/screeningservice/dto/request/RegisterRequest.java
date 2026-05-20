package aml.code.screeningservice.dto.request;

import aml.code.screeningservice.entity.enums.UserRole;
import aml.code.screeningservice.entity.users.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String name;
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be 8 characters")
    private String password;
    @Email(message = "Email should be valid")
    private String email;
    @NonNull
    private UserRole role;
}
