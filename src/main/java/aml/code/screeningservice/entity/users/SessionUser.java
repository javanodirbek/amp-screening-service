package aml.code.screeningservice.entity.users;

import aml.code.screeningservice.entity.enums.SessionUserStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "session_users")
@Builder
public class SessionUser extends Auditable {

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "access_token", nullable = false)
    private String accessToken;

    @Column(name = "refresh_token", nullable = false)
    private String refreshToken;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private SessionUserStatus status;


}
