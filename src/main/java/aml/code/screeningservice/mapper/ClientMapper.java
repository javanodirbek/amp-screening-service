package aml.code.screeningservice.mapper;

import aml.code.screeningservice.dto.request.ClientRequest;
import aml.code.screeningservice.dto.response.ClientResponse;
import aml.code.screeningservice.entity.Client;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
public interface ClientMapper {

    Client toEntity(ClientRequest request);

    ClientResponse toResponse(Client client);
}
