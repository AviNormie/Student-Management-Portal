
// Student.java
package com.example.sms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "students")
public class Student {
    @Id
    private String id;
    private String userId;  // Reference to User
    private String name;
    private String rollNumber;
    private String email;
    private String phone;
    private String courseId; // Reference to Course
    private int year;
    private String address;
}