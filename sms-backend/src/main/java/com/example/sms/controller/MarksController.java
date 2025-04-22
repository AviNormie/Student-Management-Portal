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
@CrossOrigin(origins = "*")
public class MarksController {

    @Autowired
    private MarksService marksService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<MarksResponse>> getStudentMarks(@PathVariable String studentId) {
        return ResponseEntity.ok(marksService.getStudentMarks(studentId));
    }

    @GetMapping("/student/{studentId}/subject/{subject}")
    public ResponseEntity<List<MarksResponse>> getStudentMarksBySubject(
            @PathVariable String studentId,
            @PathVariable String subject) {
        return ResponseEntity.ok(marksService.getStudentMarksBySubject(studentId, subject));
    }

    @GetMapping("/student/{studentId}/exam-type/{examType}")
    public ResponseEntity<List<MarksResponse>> getStudentMarksByExamType(
            @PathVariable String studentId,
            @PathVariable String examType) {
        return ResponseEntity.ok(marksService.getStudentMarksByExamType(studentId, examType));
    }

    @PostMapping
    public ResponseEntity<MarksResponse> addMarks(@Valid @RequestBody MarksRequest request) {
        return new ResponseEntity<>(marksService.addMarks(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MarksResponse> updateMarks(
            @PathVariable String id,
            @Valid @RequestBody MarksRequest request) {
        return ResponseEntity.ok(marksService.updateMarks(id, request));
    }
}