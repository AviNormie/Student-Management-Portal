package com.example.sms.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

@Data
public class StudentRequest {
    @NotBlank
    private String username;
    
    @NotBlank
    private String password;
    
    @NotBlank
    private String name;
    
    @NotBlank
    private String rollNumber;
    
    @Email
    private String email;
    
    private String phone;
    
    @NotBlank
    private String courseId;
    
    private Integer year;
    
    private String address;
}