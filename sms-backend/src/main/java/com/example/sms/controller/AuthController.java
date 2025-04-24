package com.example.sms.controller;

import com.example.sms.dto.request.CreateUserRequest;
import com.example.sms.dto.request.LoginRequest;
import com.example.sms.dto.response.LoginResponse;
import com.example.sms.dto.response.UserResponse;
import com.example.sms.exception.ResourceNotFoundException;
import com.example.sms.model.User;
import com.example.sms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.get("username"),
                    loginRequest.get("password")
                )
            );
    
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Get user details from repository
            User user = userRepository.findByUsername(loginRequest.get("username"))
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Create response with user data
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
            // Add other user details as needed, but avoid sending sensitive data like passwords
            
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid username or password"));
        }
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