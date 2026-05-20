package aml.code.screeningservice.entity;

import aml.code.screeningservice.entity.enums.TransactionStatus;
import aml.code.screeningservice.entity.users.Auditable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@NoArgsConstructor
@Getter
@Setter
public class Transaction extends Auditable {

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Column(nullable = false)
    private String recipientName;

    private String recipientPassport;

    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    private String currency;        //RUB USD EUR

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;

    private String reviewedBy;      //username офицера, принявшего решение

    private String reviewComment;       // коментарии к решению

    @OneToOne(mappedBy = "transaction")
    private CheckResult checkResult;
}
