
package com.example.sms.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "students")
public class Student {
    @Id
    private String id;
    private String userId;
    private String name;
    private String rollNumber;
    private String email;
    private String phone;
    private String courseId;
    private Integer year;
    private String address;
}