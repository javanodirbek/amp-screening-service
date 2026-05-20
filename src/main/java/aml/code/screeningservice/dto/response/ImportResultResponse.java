package aml.code.screeningservice.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ImportResultResponse {
    private int imported;
    private int skipped;
    private int errors;
    private List<String> errorMessages;
}
