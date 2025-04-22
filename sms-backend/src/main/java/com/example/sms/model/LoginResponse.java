package com.example.sms.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String id;
    private String username;
    private String name;
    private String email;
    private String role;
}