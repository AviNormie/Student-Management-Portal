package com.example.sms.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

@Data
public class MarksRequest {
    @NotBlank
    private String studentId;
    
    @NotBlank
    private String subject;
    
    @NotNull
    @Min(0)
    private Integer marks;
    
    @NotNull
    @Min(1)
    private Integer totalMarks;
    
    @NotBlank
    private String examType;
    
    private String addedBy;
}