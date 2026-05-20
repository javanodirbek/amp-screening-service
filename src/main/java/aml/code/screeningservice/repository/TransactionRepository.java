package aml.code.screeningservice.repository;

import aml.code.screeningservice.entity.Client;
import aml.code.screeningservice.entity.Transaction;
import aml.code.screeningservice.entity.enums.TransactionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

     Page<Transaction> findAllByStatus(TransactionStatus status, Pageable pageable);

     Page<Transaction> findAllByClient(Client client, Pageable pageable);
}
