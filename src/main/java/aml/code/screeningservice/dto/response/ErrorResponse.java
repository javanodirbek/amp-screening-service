package aml.code.screeningservice.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    private LocalDateTime timestamp;   // когда произошла ошибка
    private int status;                // HTTP код: 400, 401, 403, 404, 409, 500
    private String error;              // краткое название: "Not Found", "Bad Request"
    private String message;            // понятное сообщение об ошибке
    private String path;
}
