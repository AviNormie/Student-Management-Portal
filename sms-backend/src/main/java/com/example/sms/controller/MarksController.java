package com.example.sms.controller;

import com.example.sms.dto.request.MarksRequest;
import com.example.sms.dto.response.MarksResponse;
import com.example.sms.service.MarksService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
public class MarksController {

    @Autowired
    private MarksService marksService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<MarksResponse>> getStudentMarks(@PathVariable String studentId) {
        return ResponseEntity.ok(marksService.getStudentMarks(studentId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<MarksResponse>> getCourseMarks(@PathVariable String courseId) {
        return ResponseEntity.ok(marksService.getCourseMarks(courseId));
    }

    @PostMapping
    public ResponseEntity<MarksResponse> addMarks(@Valid @RequestBody MarksRequest request) {
        return new ResponseEntity<>(marksService.addMarks(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MarksResponse> updateMarks(@PathVariable String id, @Valid @RequestBody MarksRequest request) {
        return ResponseEntity.ok(marksService.updateMarks(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMarks(@PathVariable String id) {
        marksService.deleteMarks(id);
        return ResponseEntity.noContent().build();
    }
}