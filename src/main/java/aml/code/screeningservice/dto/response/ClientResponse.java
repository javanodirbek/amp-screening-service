package aml.code.screeningservice.dto.response;

import aml.code.screeningservice.entity.enums.ClientStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ClientResponse {
    private Long id;
    private String fullName;
    private LocalDateTime birthDate;
    private String passportNumber;
    private String inn;
    private String email;
    private String phone;
    private ClientStatus status;
    private LocalDateTime createdAt;
}
