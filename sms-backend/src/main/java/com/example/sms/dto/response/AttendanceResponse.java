package com.example.sms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {
    private String id;
    private String studentId;
    private String courseId;
    private LocalDate date;
    private boolean present;
    private String markedBy;
}