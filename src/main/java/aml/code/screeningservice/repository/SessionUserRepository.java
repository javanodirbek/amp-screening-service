package aml.code.screeningservice.repository;

import aml.code.screeningservice.entity.users.SessionUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionUserRepository extends JpaRepository<SessionUser, Long> {
    SessionUser findByUserId(Long id);
}
