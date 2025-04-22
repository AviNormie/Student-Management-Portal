package com.example.sms.repository;

import com.example.sms.model.Marks;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarksRepository extends MongoRepository<Marks, String> {
    List<Marks> findByStudentId(String studentId);
    List<Marks> findByStudentIdAndSubject(String studentId, String subject);
    List<Marks> findByStudentIdAndExamType(String studentId, String examType);
    List<Marks> findByCourseId(String courseId);
    List<Marks> findByCourseIdAndSubject(String courseId, String subject);
}