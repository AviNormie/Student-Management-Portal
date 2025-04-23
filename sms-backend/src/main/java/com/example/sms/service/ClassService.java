package com.example.sms.service;

import com.example.sms.dto.request.ClassRequest;
import com.example.sms.dto.response.ClassResponse;
import com.example.sms.exception.ResourceNotFoundException;
import com.example.sms.model.Class;
import com.example.sms.repository.ClassRepository;
import com.example.sms.repository.CourseRepository;
import com.example.sms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClassService {

    @Autowired
    private ClassRepository classRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<ClassResponse> getAllClasses() {
        return classRepository.findAll().stream()
                .map(this::convertToClassResponse)
                .collect(Collectors.toList());
    }
    
    public ClassResponse getClassById(String id) {
        Class classEntity = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));
        return convertToClassResponse(classEntity);
    }
    
    public List<ClassResponse> getClassesByCourseId(String courseId) {
        // Verify course exists
        courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
                
        return classRepository.findByCourseId(courseId).stream()
                .map(this::convertToClassResponse)
                .collect(Collectors.toList());
    }
    
    public List<ClassResponse> getClassesByTeacherId(String teacherId) {
        // Verify teacher exists
        userRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));
                
        return classRepository.findByTeacherId(teacherId).stream()
                .map(this::convertToClassResponse)
                .collect(Collectors.toList());
    }
    
    public List<ClassResponse> getTeacherClassesByDateRange(String teacherId, LocalDate startDate, LocalDate endDate) {
        return classRepository.findByTeacherIdAndDateBetween(teacherId, startDate, endDate).stream()
                .map(this::convertToClassResponse)
                .collect(Collectors.toList());
    }
    
    public ClassResponse createClass(ClassRequest request) {
        // Verify course exists
        courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + request.getCourseId()));
                
        // Verify teacher exists
        userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + request.getTeacherId()));
        
        Class classEntity = new Class();
        classEntity.setCourseId(request.getCourseId());
        classEntity.setTeacherId(request.getTeacherId());
        classEntity.setSubject(request.getSubject());
        classEntity.setTitle(request.getTitle());
        classEntity.setDescription(request.getDescription());
        classEntity.setDate(request.getDate());
        classEntity.setStartTime(request.getStartTime());
        classEntity.setEndTime(request.getEndTime());
        classEntity.setRoomNumber(request.getRoomNumber());
        
        Class savedClass = classRepository.save(classEntity);
        return convertToClassResponse(savedClass);
    }
    
    public ClassResponse updateClass(String id, ClassRequest request) {
        Class classEntity = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));
        
        // Verify course exists
        courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + request.getCourseId()));
                
        // Verify teacher exists
        userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + request.getTeacherId()));
        
        classEntity.setCourseId(request.getCourseId());
        classEntity.setTeacherId(request.getTeacherId());
        classEntity.setSubject(request.getSubject());
        classEntity.setTitle(request.getTitle());
        classEntity.setDescription(request.getDescription());
        classEntity.setDate(request.getDate());
        classEntity.setStartTime(request.getStartTime());
        classEntity.setEndTime(request.getEndTime());
        classEntity.setRoomNumber(request.getRoomNumber());
        
        Class updatedClass = classRepository.save(classEntity);
        return convertToClassResponse(updatedClass);
    }
    
    public void deleteClass(String id) {
        // Check if class exists
        classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));
        
        // Delete the class
        classRepository.deleteById(id);
    }
    
    private ClassResponse convertToClassResponse(Class classEntity) {
        return new ClassResponse(
                classEntity.getId(),
                classEntity.getCourseId(),
                classEntity.getTeacherId(),
                classEntity.getSubject(),
                classEntity.getTitle(),
                classEntity.getDescription(),
                classEntity.getDate(),
                classEntity.getStartTime(),
                classEntity.getEndTime(),
                classEntity.getRoomNumber()
        );
    }
}