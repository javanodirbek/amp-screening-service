package aml.code.screeningservice.mapper;

import aml.code.screeningservice.dto.request.TransactionRequest;
import aml.code.screeningservice.dto.response.TransactionResponse;
import aml.code.screeningservice.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = CheckResultMapper.class)
public interface TransactionMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "client.id", source = "clientId")
    @Mapping(target = "status", constant = "PENDING")
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    Transaction toEntity(TransactionRequest request);

    @Mapping(target = "clientId", source = "client.id")
    @Mapping(target = "clientName", source = "client.fullName")
    TransactionResponse toResponse(Transaction transaction);
}
