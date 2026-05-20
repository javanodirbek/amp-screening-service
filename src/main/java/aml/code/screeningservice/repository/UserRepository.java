package aml.code.screeningservice.repository;

import aml.code.screeningservice.entity.users.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);

    boolean existsByUsername(String name);
}
