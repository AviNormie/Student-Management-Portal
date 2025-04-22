package com.example.sms.controller;

import com.example.sms.model.LoginRequest;
import com.example.sms.model.LoginResponse;

import com.example.sms.model.User;
import com.example.sms.repository.UserRepository;
import com.example.sms.exception.ResourceNotFoundException; // Add this import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid credentials"));
                
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new ResourceNotFoundException("Invalid credentials");
        }
        
        if (!user.getRole().equals(loginRequest.getRole())) {
            throw new ResourceNotFoundException("Invalid role for this user");
        }

        LoginResponse response = new LoginResponse(
            user.getId(),
            user.getUsername(),
            user.getName(),
            user.getEmail(),
            user.getRole()
        );
        return ResponseEntity.ok(response);
    }
}