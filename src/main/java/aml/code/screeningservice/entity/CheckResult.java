package aml.code.screeningservice.entity;

import aml.code.screeningservice.entity.enums.MatchResult;
import aml.code.screeningservice.entity.users.Auditable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "check_results")
@NoArgsConstructor
@Getter
@Setter
public class CheckResult extends Auditable {

    @OneToOne
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    @ManyToOne
    @JoinColumn(name = "matched_entry_id")
    private BlacklistEntry matchedEntry;    //null если CLEAR

    @Column(nullable = false)
    private Double matchScore;              // степень совпадения

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatchResult result;

    @Column(nullable = false)
    private Double threshold;               // порог, который используется

    @Column(nullable = false)
    private LocalDateTime checkDate;

    private String algorithm;           // "LEVENSHTEIN" / "JARO_WINKLER"
}
