package aml.code.screeningservice.mapper;

import aml.code.screeningservice.dto.request.BlacklistEntryRequest;
import aml.code.screeningservice.dto.response.BlacklistEntryResponse;
import aml.code.screeningservice.entity.BlacklistEntry;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface BlackListMapper {


    BlacklistEntry toEntity(BlacklistEntryRequest request);

    BlacklistEntryResponse toResponse(BlacklistEntry blacklistEntry);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromRequest(BlacklistEntryRequest request, @MappingTarget BlacklistEntry entry);
}
