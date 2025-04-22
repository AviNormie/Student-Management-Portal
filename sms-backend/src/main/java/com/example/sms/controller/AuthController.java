package com.example.sms.controller;

import com.example.sms.model.LoginRequest;
import com.example.sms.model.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        // TODO: Implement authentication logic
        // For now, return a dummy response
        LoginResponse response = new LoginResponse(
            "1",
            loginRequest.getUsername(),
            "Test User",
            "test@example.com",
            loginRequest.getRole()
        );
        return ResponseEntity.ok(response);
    }
}