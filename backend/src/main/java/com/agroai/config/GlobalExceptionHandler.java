package com.agroai.config;

import com.agroai.dto.ApiError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Centralized error handling so every API returns a consistent
 * { status, error, message, timestamp } shape (section 25 of the spec).
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        List<String> details = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.toList());
        ApiError error = new ApiError(400, "BAD_REQUEST", "Invalid request data");
        error.setDetails(details);
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(new ApiError(400, "BAD_REQUEST", ex.getMessage()));
    }

    @ExceptionHandler(NoSuchElementFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(NoSuchElementFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiError(404, "NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiError> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiError(401, "UNAUTHORIZED", ex.getMessage()));
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiError> handleDuplicate(DuplicateResourceException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiError(400, "DUPLICATE_RESOURCE", ex.getMessage()));
    }

    @ExceptionHandler(ExternalServiceException.class)
    public ResponseEntity<ApiError> handleExternalService(ExternalServiceException ex) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(new ApiError(503, "SERVICE_UNAVAILABLE", ex.getMessage()));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiError> handleUploadSize(MaxUploadSizeExceededException ex) {
        return ResponseEntity.badRequest().body(new ApiError(400, "BAD_REQUEST", "Invalid image: file is too large"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiError(500, "INTERNAL_SERVER_ERROR", "Something went wrong. Please try again."));
    }
}
