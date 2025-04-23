package com.example.sms.service;

import com.example.sms.dto.request.MarksRequest;
import com.example.sms.dto.response.MarksResponse;
import com.example.sms.exception.ResourceNotFoundException;
import com.example.sms.model.Marks;
import com.example.sms.model.Student;
import com.example.sms.repository.MarksRepository;
import com.example.sms.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MarksService {

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<MarksResponse> getStudentMarks(String studentId) {
        // Verify student exists
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        return marksRepository.findByStudentId(studentId).stream()
                .map(this::convertToMarksResponse)
                .collect(Collectors.toList());
    }

    public List<MarksResponse> getStudentMarksBySubject(String studentId, String subject) {
        return marksRepository.findByStudentIdAndSubject(studentId, subject).stream()
                .map(this::convertToMarksResponse)
                .collect(Collectors.toList());
    }

    public List<MarksResponse> getStudentMarksByExamType(String studentId, String examType) {
        return marksRepository.findByStudentIdAndExamType(studentId, examType).stream()
                .map(this::convertToMarksResponse)
                .collect(Collectors.toList());
    }

    public List<MarksResponse> getCourseMarks(String courseId) {
        // Implementation to get marks for a specific course
        return marksRepository.findByCourseId(courseId)
            .stream()
            .map(this::convertToMarksResponse)
            .collect(Collectors.toList());
    }

    public void deleteMarks(String id) {
        // Check if marks exist
        marksRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Marks not found with id: " + id));
        
        // Delete the marks
        marksRepository.deleteById(id);
    }

    public MarksResponse addMarks(MarksRequest request) {
        // Verify student exists
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.getStudentId()));

        Marks marks = new Marks();
        marks.setStudentId(request.getStudentId());
        marks.setSubject(request.getSubject());
        marks.setCourseId(student.getCourseId());
        marks.setMarks(request.getMarks());
        marks.setTotalMarks(request.getTotalMarks());
        marks.setExamType(request.getExamType());
        marks.setAddedBy(request.getAddedBy());

        Marks savedMarks = marksRepository.save(marks);
        return convertToMarksResponse(savedMarks);
    }

    public MarksResponse updateMarks(String id, MarksRequest request) {
        Marks marks = marksRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Marks not found with id: " + id));

        marks.setMarks(request.getMarks());
        marks.setTotalMarks(request.getTotalMarks());
        marks.setExamType(request.getExamType());
        marks.setAddedBy(request.getAddedBy());

        Marks updatedMarks = marksRepository.save(marks);
        return convertToMarksResponse(updatedMarks);
    }

    private MarksResponse convertToMarksResponse(Marks marks) {
        return new MarksResponse(
                marks.getId(),
                marks.getStudentId(),
                marks.getSubject(),
                marks.getCourseId(),
                marks.getMarks(),
                marks.getTotalMarks(),
                marks.getExamType(),
                marks.getAddedBy()
        );
    }
}