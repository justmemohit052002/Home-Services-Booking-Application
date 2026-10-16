package com.adityax.homeservices.dto;

import java.time.LocalDateTime;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiErrorResponse {

    private LocalDateTime timestamp;
    private int status;
    private String message;
    private Map<String, String> errors;

    public ApiErrorResponse() {
    }

    public ApiErrorResponse(LocalDateTime timestamp, int status, String message, Map<String, String> errors) {
        this.timestamp = timestamp;
        this.status = status;
        this.message = message;
        this.errors = errors;
    }
}