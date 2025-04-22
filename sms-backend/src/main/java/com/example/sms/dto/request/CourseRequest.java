package com.example.sms.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class CourseRequest {
    @NotBlank
    private String name;
    
    @NotBlank
    private String code;
    
    private String description;
    
    @NotNull
    private String[] subjects;
    
    @NotNull
    private Integer duration;
}