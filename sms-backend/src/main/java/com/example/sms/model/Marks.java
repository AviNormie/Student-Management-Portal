
// Marks.java
package com.example.sms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "marks")
public class Marks {
    @Id
    private String id;
    private String studentId;
    private String subject;
    private String courseId;
    private double marks;
    private double totalMarks;
    private String examType; // "midterm", "final", "assignment"
    private String addedBy; // Teacher's userId
}