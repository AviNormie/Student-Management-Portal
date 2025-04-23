package com.example.sms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ClassRequest {
    @NotBlank(message = "Course ID is required")
    private String courseId;
    
    @NotBlank(message = "Teacher ID is required")
    private String teacherId;
    
    @NotBlank(message = "Subject is required")
    private String subject;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    @NotNull(message = "Start time is required")
    private LocalTime startTime;
    
    @NotNull(message = "End time is required")
    private LocalTime endTime;
    
    private String roomNumber;
}