package aml.code.screeningservice.entity;

import aml.code.screeningservice.entity.enums.ClientStatus;
import aml.code.screeningservice.entity.users.Auditable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "clients")
@NoArgsConstructor
@Getter
@Setter
public class Client extends Auditable {

    @Column(nullable = false)
    private String fullName;

    private LocalDate birthday;

    @Column(name = "passport_number", nullable = false)
    private String passportNumber;

    private String inn;

    private String phone;

    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    private ClientStatus status;
}
