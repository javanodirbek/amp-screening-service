package aml.code.screeningservice.repository;

import aml.code.screeningservice.entity.BlacklistEntry;
import aml.code.screeningservice.entity.enums.EntryStatus;
import aml.code.screeningservice.entity.enums.ListType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BlacklistRepository extends JpaRepository<BlacklistEntry, Long> {

    Page<BlacklistEntry> findByStatus(EntryStatus status, Pageable pageable);

    Page<BlacklistEntry> findByListType(ListType listType, Pageable pageable);

    Page<BlacklistEntry> findByStatusAndListType(EntryStatus status, ListType listType, Pageable pageable);

    List<BlacklistEntry> findAllByStatus(EntryStatus status);

    boolean existsByPassportNumber(String passportNumber);

    @Query("SELECT b FROM BlacklistEntry b WHERE b.status = :status " +
            "AND LOWER(b.fullName) LIKE LOWER(CONCAT('%', :namePart, '%'))")
    List<BlacklistEntry> findActiveByNameContaining(
            @Param("status") EntryStatus status,
            @Param("namePart") String namePart
    );
}