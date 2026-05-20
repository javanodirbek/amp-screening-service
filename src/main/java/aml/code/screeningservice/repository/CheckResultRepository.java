package aml.code.screeningservice.repository;

import aml.code.screeningservice.entity.CheckResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckResultRepository extends JpaRepository<CheckResult, Long> {
}
