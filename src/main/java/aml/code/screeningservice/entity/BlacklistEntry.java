package aml.code.screeningservice.entity;

import aml.code.screeningservice.entity.enums.EntryStatus;
import aml.code.screeningservice.entity.users.Auditable;
import jakarta.persistence.*;
import aml.code.screeningservice.entity.enums.ListType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "blacklist_entries")
@NoArgsConstructor
@Getter
@Setter
public class BlacklistEntry extends Auditable {

    @Column(nullable = false)
    private String fullName;

    private LocalDate birthday;

    private String passportNumber;

    private String inn;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListType listType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntryStatus status;

    @Column(nullable = false)
    private LocalDateTime addedAt;

    private String addedBy;
}
