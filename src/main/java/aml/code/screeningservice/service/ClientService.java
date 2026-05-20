package aml.code.screeningservice.service;

import aml.code.screeningservice.dto.request.ClientRequest;
import aml.code.screeningservice.dto.response.ClientResponse;
import aml.code.screeningservice.entity.Client;
import aml.code.screeningservice.exception.ResourceNotFoundException;
import aml.code.screeningservice.mapper.ClientMapper;
import aml.code.screeningservice.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    private static final String EXCEPTION_MESSAGE = "client.not.found";

    public Long create(ClientRequest request) {
        Client client = clientMapper.toEntity(request);
        return clientRepository.save(client).getId();
    }

    public List<ClientResponse> getAll() {
        return clientRepository.findAll().stream()
                .map(clientMapper::toResponse).toList();
    }

    public ClientResponse getById(Long id) {
    Client client = clientRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException(EXCEPTION_MESSAGE));
        return clientMapper.toResponse(client);
    }
}
