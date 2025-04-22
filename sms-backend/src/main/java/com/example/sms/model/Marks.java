
package com.example.sms.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "marks")
public class Marks {
    @Id
    private String id;
    private String studentId;
    private String subject;
    private String courseId;
    private Integer marks;
    private Integer totalMarks;
    private String examType;
    private String addedBy;
}