package com.example.sms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarksResponse {
    private String id;
    private String studentId;
    private String subject;
    private String courseId;
    private double marks;
    private double totalMarks;
    private String examType;
    private String addedBy;
}