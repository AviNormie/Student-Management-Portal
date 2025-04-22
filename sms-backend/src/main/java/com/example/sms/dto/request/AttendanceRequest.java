package com.example.sms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequest {
    @NotBlank(message = "Student ID is required")
    private String studentId;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    @NotNull(message = "Present status is required")
    private boolean present;
    
    @NotBlank(message = "Marked by is required")
    private String markedBy;
}