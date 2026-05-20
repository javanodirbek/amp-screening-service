package aml.code.screeningservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReviewRequest {

    @NotBlank(message = "Comment is required for review actions")
    private String comment;
}
