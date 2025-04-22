package com.example.sms.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarksRequest {
    @NotBlank(message = "Student ID is required")
    private String studentId;
    
    @NotBlank(message = "Subject is required")
    private String subject;
    
    @NotNull(message = "Marks is required")
    @Min(value = 0, message = "Marks cannot be negative")
    private double marks;
    
    @NotNull(message = "Total marks is required")
    @Min(value = 0, message = "Total marks cannot be negative")
    private double totalMarks;
    
    @NotBlank(message = "Exam type is required")
    private String examType;
    
    @NotBlank(message = "Added by is required")
    private String addedBy;
}