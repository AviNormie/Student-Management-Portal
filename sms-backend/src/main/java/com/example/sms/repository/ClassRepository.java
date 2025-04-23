package com.example.sms.repository;

import com.example.sms.model.Class;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface ClassRepository extends MongoRepository<Class, String> {
    List<Class> findByCourseId(String courseId);
    List<Class> findByTeacherId(String teacherId);
    List<Class> findByTeacherIdAndDateBetween(String teacherId, LocalDate startDate, LocalDate endDate);
    List<Class> findByCourseIdAndDateBetween(String courseId, LocalDate startDate, LocalDate endDate);
}