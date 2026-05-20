package aml.code.screeningservice.mapper;

import aml.code.screeningservice.dto.response.CheckResultResponse;
import aml.code.screeningservice.entity.CheckResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CheckResultMapper {

    @Mapping(target = "result", expression = "java(checkResult.getResult().name())")
    @Mapping(target = "matchedEntryId", source = "matchedEntry.id")
    @Mapping(target = "matchedEntryName", source = "matchedEntry.fullName")
    CheckResultResponse toResponse(CheckResult checkResult);
}
