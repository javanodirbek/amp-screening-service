package aml.code.screeningservice.handler;

import aml.code.screeningservice.exception.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import aml.code.screeningservice.util.ErrorUtil;
import aml.code.screeningservice.util.Translator;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestControllerAdvice
@Slf4j
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final Translator translator;

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFound(ResourceNotFoundException ex) {
        log.error("ResourceNotFoundException on: {}", ErrorUtil.getStacktrace(ex));
        return new ResponseEntity<>(Map.of("message", List.of(translator.toLocale(ex.getMessage()))),
                HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidInputException.class)
    public ResponseEntity<Object> handleInvalidInput(InvalidInputException ex) {
        log.error("InvalidInputException on: {}", ErrorUtil.getStacktrace(ex));
        return new ResponseEntity<>(Map.of("message", List.of(translator.toLocale(ex.getMessage()))),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Object> handleDuplicateResource(DuplicateResourceException ex) {
        log.error("DuplicateResourceException on: {}", ErrorUtil.getStacktrace(ex));
        return new ResponseEntity<>(Map.of("message", List.of(translator.toLocale(ex.getMessage()))),
                HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidCredentialException.class)
    public ResponseEntity<Object> handleInvalidCredential(InvalidCredentialException ex) {
        log.error("InvalidCredentialException on: {}", ErrorUtil.getStacktrace(ex));
        return new ResponseEntity<>(Map.of("message", List.of(translator.toLocale(ex.getMessage()))),
                HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(InvalidStatusTransitionException.class)
    public ResponseEntity<Object> handleInvalidStatusTransition(InvalidStatusTransitionException ex) {
        log.error("InvalidStatusTransitionException on: {}", ErrorUtil.getStacktrace(ex));
        return new ResponseEntity<>(Map.of("message", List.of(translator.toLocale(ex.getMessage()))),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UnauthorizedActionException.class)
    public ResponseEntity<Object> handleUnauthorizedAction(UnauthorizedActionException ex) {
        log.error("UnauthorizedActionException on: {}", ErrorUtil.getStacktrace(ex));
        return new ResponseEntity<>(Map.of("message", List.of(translator.toLocale(ex.getMessage()))),
                HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Object> handleUserNotFound(UserNotFoundException ex) {
        log.error("UserNotFoundException on: {}", ErrorUtil.getStacktrace(ex));
        return new ResponseEntity<>(Map.of("message", List.of(translator.toLocale(ex.getMessage()))),
                HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleError(final MethodArgumentNotValidException ex) {
        log.error("MethodArgumentNotValidException on: {}", ErrorUtil.getStacktrace(ex));
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(fieldError ->
                {
                    if (!translator.toLocale(fieldError.getDefaultMessage()).equals(fieldError.getDefaultMessage())) {
                        return Objects.requireNonNull(translator.toLocale(fieldError.getDefaultMessage()));
                    } else {
                        return fieldError.getField() + ": " + fieldError.getDefaultMessage();
                    }

                }).toList();
        return new ResponseEntity<>(Map.of("message", errors), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

}
