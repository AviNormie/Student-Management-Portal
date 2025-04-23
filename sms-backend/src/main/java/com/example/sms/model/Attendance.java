// Attendance.java
package com.example.sms.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@Document(collection = "attendance")
public class Attendance {
    @Id
    private String id;
    private String studentId;
    private String courseId;
    private String classId;
    private LocalDate date;
    private boolean present;
    private String remarks;
}
