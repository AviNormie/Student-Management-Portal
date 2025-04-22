package com.example.sms.service;

import com.example.sms.dto.request.AttendanceRequest;
import com.example.sms.dto.response.AttendanceResponse;
import com.example.sms.exception.ResourceNotFoundException;
import com.example.sms.model.Attendance;
import com.example.sms.model.Student;
import com.example.sms.repository.AttendanceRepository;
import com.example.sms.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<AttendanceResponse> getStudentAttendance(String studentId) {
        // Verify student exists
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        return attendanceRepository.findByStudentId(studentId).stream()
                .map(this::convertToAttendanceResponse)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponse> getStudentAttendanceByDateRange(String studentId, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByStudentIdAndDateBetween(studentId, startDate, endDate).stream()
                .map(this::convertToAttendanceResponse)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponse> getCourseAttendanceByDate(String courseId, LocalDate date) {
        return attendanceRepository.findByCourseIdAndDate(courseId, date).stream()
                .map(this::convertToAttendanceResponse)
                .collect(Collectors.toList());
    }

    public AttendanceResponse markAttendance(AttendanceRequest request) {
        // Verify student exists
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.getStudentId()));

        // Check if attendance already marked for this date
        Optional<Attendance> existingAttendance = attendanceRepository
                .findByStudentIdAndDate(request.getStudentId(), request.getDate());

        Attendance attendance;
        if (existingAttendance.isPresent()) {
            // Update existing attendance
            attendance = existingAttendance.get();
            attendance.setPresent(request.isPresent());
            attendance.setMarkedBy(request.getMarkedBy());
        } else {
            // Create new attendance record
            attendance = new Attendance();
            attendance.setStudentId(request.getStudentId());
            attendance.setCourseId(student.getCourseId());
            attendance.setDate(request.getDate());
            attendance.setPresent(request.isPresent());
            attendance.setMarkedBy(request.getMarkedBy());
        }

        Attendance savedAttendance = attendanceRepository.save(attendance);
        return convertToAttendanceResponse(savedAttendance);
    }

    private AttendanceResponse convertToAttendanceResponse(Attendance attendance) {
        return new AttendanceResponse(
                attendance.getId(),
                attendance.getStudentId(),
                attendance.getCourseId(),
                attendance.getDate(),
                attendance.isPresent(),
                attendance.getMarkedBy()
        );
    }
}