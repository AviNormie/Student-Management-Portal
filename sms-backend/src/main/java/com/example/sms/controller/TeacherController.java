package com.example.sms.controller;

import com.example.sms.dto.request.CreateUserRequest;
import com.example.sms.dto.response.UserResponse;
import com.example.sms.model.User;
import com.example.sms.repository.UserRepository;
import com.example.sms.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllTeachers() {
        List<User> teachers = userRepository.findAll().stream()
                .filter(user -> "TEACHER".equals(user.getRole()))
                .collect(Collectors.toList());
                
        List<UserResponse> response = teachers.stream()
                .map(teacher -> new UserResponse(
                    teacher.getId(),
                    teacher.getUsername(),
                    teacher.getName(),
                    teacher.getEmail(),
                    teacher.getRole()
                ))
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getTeacherById(@PathVariable String id) {
        User teacher = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
                
        if (!"TEACHER".equals(teacher.getRole())) {
            throw new ResourceNotFoundException("User with id: " + id + " is not a teacher");
        }
        
        UserResponse response = new UserResponse(
            teacher.getId(),
            teacher.getUsername(),
            teacher.getName(),
            teacher.getEmail(),
            teacher.getRole()
        );
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    public ResponseEntity<UserResponse> createTeacher(@RequestBody CreateUserRequest request) {
        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        // Create new teacher user
        User teacher = new User();
        teacher.setUsername(request.getUsername());
        teacher.setPassword(passwordEncoder.encode(request.getPassword()));
        teacher.setName(request.getName());
        teacher.setEmail(request.getEmail());
        teacher.setRole("TEACHER"); // Set role to TEACHER
        
        // Save to database
        User savedTeacher = userRepository.save(teacher);
        
        // Create response
        UserResponse response = new UserResponse(
            savedTeacher.getId(),
            savedTeacher.getUsername(),
            savedTeacher.getName(),
            savedTeacher.getEmail(),
            savedTeacher.getRole()
        );
        
        return ResponseEntity.ok(response);
    }
}