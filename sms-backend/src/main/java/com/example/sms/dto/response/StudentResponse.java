package com.example.sms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {
    private String id;
    private String username;
    private String name;
    private String rollNumber;
    private String email;
    private String phone;
    private String courseId;
    private int year;
    private String address;
}