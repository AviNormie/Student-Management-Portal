package com.example.sms.controller;

import com.example.sms.dto.request.ClassRequest;
import com.example.sms.dto.response.ClassResponse;
import com.example.sms.service.ClassService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    @Autowired
    private ClassService classService;

    @GetMapping
    public ResponseEntity<List<ClassResponse>> getAllClasses() {
        return ResponseEntity.ok(classService.getAllClasses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassResponse> getClassById(@PathVariable String id) {
        return ResponseEntity.ok(classService.getClassById(id));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ClassResponse>> getClassesByCourseId(@PathVariable String courseId) {
        return ResponseEntity.ok(classService.getClassesByCourseId(courseId));
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<ClassResponse>> getClassesByTeacherId(@PathVariable String teacherId) {
        return ResponseEntity.ok(classService.getClassesByTeacherId(teacherId));
    }

    @GetMapping("/teacher/{teacherId}/range")
    public ResponseEntity<List<ClassResponse>> getTeacherClassesByDateRange(
            @PathVariable String teacherId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(classService.getTeacherClassesByDateRange(teacherId, startDate, endDate));
    }

    @PostMapping
    public ResponseEntity<ClassResponse> createClass(@Valid @RequestBody ClassRequest request) {
        return new ResponseEntity<>(classService.createClass(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassResponse> updateClass(@PathVariable String id, @Valid @RequestBody ClassRequest request) {
        return ResponseEntity.ok(classService.updateClass(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable String id) {
        classService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }
}