package aml.code.screeningservice.dto.response;

import aml.code.screeningservice.entity.enums.UserRole;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private UserRole role;
    private Boolean active;
    private LocalDateTime createdAt;
}
