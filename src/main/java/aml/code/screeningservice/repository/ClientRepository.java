package aml.code.screeningservice.repository;

import aml.code.screeningservice.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> getClientById(Long id);
}
