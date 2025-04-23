package com.example.sms.controller;

import com.example.sms.dto.request.LoginRequest;
import com.example.sms.dto.response.LoginResponse;
import com.example.sms.dto.request.CreateUserRequest;
import com.example.sms.dto.response.UserResponse;

import com.example.sms.model.User;
import com.example.sms.repository.UserRepository;
import com.example.sms.exception.ResourceNotFoundException;
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
    
    @PostMapping("/register/admin")
    public ResponseEntity<UserResponse> createAdmin(@RequestBody CreateUserRequest request) {
        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        // Create new admin user
        User admin = new User();
        admin.setUsername(request.getUsername());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setRole("ADMIN"); // Set role to ADMIN
        
        // Save to database
        User savedAdmin = userRepository.save(admin);
        
        // Create response
        UserResponse response = new UserResponse(
            savedAdmin.getId(),
            savedAdmin.getUsername(),
            savedAdmin.getName(),
            savedAdmin.getEmail(),
            savedAdmin.getRole()
        );
        
        return ResponseEntity.ok(response);
    }
}