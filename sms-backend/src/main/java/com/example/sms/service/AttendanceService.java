package com.example.sms.service;

import com.example.sms.dto.request.AttendanceRequest;
import com.example.sms.dto.response.AttendanceResponse;
import com.example.sms.exception.ResourceNotFoundException;
import com.example.sms.model.Attendance;
import com.example.sms.repository.AttendanceRepository;
import com.example.sms.repository.ClassRepository;
import com.example.sms.repository.CourseRepository;
import com.example.sms.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private ClassRepository classRepository;

    public List<AttendanceResponse> getStudentAttendance(String studentId) {
        // Verify student exists
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
                
        return attendanceRepository.findByStudentId(studentId).stream()
                .map(this::convertToAttendanceResponse)
                .collect(Collectors.toList());
    }
    
    public List<AttendanceResponse> getStudentAttendanceByDateRange(String studentId, LocalDate startDate, LocalDate endDate) {
        // Verify student exists
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
                
        return attendanceRepository.findByStudentIdAndDateBetween(studentId, startDate, endDate).stream()
                .map(this::convertToAttendanceResponse)
                .collect(Collectors.toList());
    }
    
    public List<AttendanceResponse> getCourseAttendanceByDate(String courseId, LocalDate date) {
        // Verify course exists
        courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
                
        return attendanceRepository.findByCourseIdAndDate(courseId, date).stream()
                .map(this::convertToAttendanceResponse)
                .collect(Collectors.toList());
    }
    
    public List<AttendanceResponse> getClassAttendance(String classId) {
        // Verify class exists
        classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));
                
        return attendanceRepository.findByClassId(classId).stream()
                .map(this::convertToAttendanceResponse)
                .collect(Collectors.toList());
    }
    
    public AttendanceResponse markAttendance(AttendanceRequest request) {
        // Verify student exists
        studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.getStudentId()));
                
        // Verify course exists
        courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + request.getCourseId()));
                
        // Verify class exists
        classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.getClassId()));
        
        // Check if attendance already exists for this student, class and date
        attendanceRepository.findByStudentIdAndClassIdAndDate(
                request.getStudentId(), 
                request.getClassId(), 
                request.getDate()
            ).ifPresent(a -> {
                throw new IllegalArgumentException("Attendance already marked for this student in this class on this date");
            });
        
        Attendance attendance = new Attendance();
        attendance.setStudentId(request.getStudentId());
        attendance.setCourseId(request.getCourseId());
        attendance.setClassId(request.getClassId());
        attendance.setDate(request.getDate());
        attendance.setPresent(request.isPresent());
        attendance.setRemarks(request.getRemarks());
        
        Attendance savedAttendance = attendanceRepository.save(attendance);
        return convertToAttendanceResponse(savedAttendance);
    }
    
    private AttendanceResponse convertToAttendanceResponse(Attendance attendance) {
        return new AttendanceResponse(
                attendance.getId(),
                attendance.getStudentId(),
                attendance.getCourseId(),
                attendance.getClassId(),
                attendance.getDate(),
                attendance.isPresent(),
                attendance.getRemarks()
        );
    }
}