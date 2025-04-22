package com.example.sms.service;

import com.example.sms.dto.request.StudentRequest;
import com.example.sms.dto.response.StudentResponse;
import com.example.sms.exception.ResourceNotFoundException;
import com.example.sms.model.Student;
import com.example.sms.model.User;
import com.example.sms.repository.CourseRepository;
import com.example.sms.repository.StudentRepository;
import com.example.sms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::convertToStudentResponse)
                .collect(Collectors.toList());
    }

    public StudentResponse getStudentById(String id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return convertToStudentResponse(student);
    }

    public StudentResponse getStudentByUserId(String userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with userId: " + userId));
        return convertToStudentResponse(student);
    }

    @Transactional
    public StudentResponse createStudent(StudentRequest request) {
        // Validate if course exists
        courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + request.getCourseId()));

        // Create user first
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRole("student");
        User savedUser = userRepository.save(user);

        // Create student
        Student student = new Student();
        student.setUserId(savedUser.getId());
        student.setName(request.getName());
        student.setRollNumber(request.getRollNumber());
        student.setEmail(request.getEmail());
        student.setPhone(request.getPhone());
        student.setCourseId(request.getCourseId());
        student.setYear(request.getYear());
        student.setAddress(request.getAddress());
        Student savedStudent = studentRepository.save(student);

        return convertToStudentResponse(savedStudent);
    }

    @Transactional
    public StudentResponse updateStudent(String id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        // Validate if course exists
        courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + request.getCourseId()));

        // Update user info
        User user = userRepository.findById(student.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + student.getUserId()));
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        userRepository.save(user);

        // Update student
        student.setName(request.getName());
        student.setRollNumber(request.getRollNumber());
        student.setEmail(request.getEmail());
        student.setPhone(request.getPhone());
        student.setCourseId(request.getCourseId());
        student.setYear(request.getYear());
        student.setAddress(request.getAddress());
        Student savedStudent = studentRepository.save(student);

        return convertToStudentResponse(savedStudent);
    }

    @Transactional
    public void deleteStudent(String id) {
        // Verify student exists
        studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        
        // Delete the student
        studentRepository.deleteById(id);
    }

    private StudentResponse convertToStudentResponse(Student student) {
        // Get the associated user
        User user = userRepository.findById(student.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + student.getUserId()));

        return new StudentResponse(
                student.getId(),
                user.getUsername(),    // Get username from User entity
                student.getName(),
                student.getRollNumber(),
                student.getEmail(),
                student.getPhone(),
                student.getCourseId(),
                student.getYear(),
                student.getAddress()
        );
    }
}