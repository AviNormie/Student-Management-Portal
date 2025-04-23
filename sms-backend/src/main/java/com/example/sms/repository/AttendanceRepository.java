package com.example.sms.repository;

import com.example.sms.model.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends MongoRepository<Attendance, String> {
    List<Attendance> findByStudentId(String studentId);
    List<Attendance> findByStudentIdAndDateBetween(String studentId, LocalDate startDate, LocalDate endDate);
    List<Attendance> findByCourseIdAndDate(String courseId, LocalDate date);
    List<Attendance> findByClassId(String classId);
    Optional<Attendance> findByStudentIdAndClassIdAndDate(String studentId, String classId, LocalDate date);
}