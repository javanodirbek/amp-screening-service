package aml.code.screeningservice.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class BulkImportRequest {

    @NotNull
    @Size(min = 1, message = "At least one entry required")
    private List<@Valid BlacklistEntryRequest> entries;

}
