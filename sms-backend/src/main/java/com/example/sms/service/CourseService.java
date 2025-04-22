package com.example.sms.service;

import com.example.sms.dto.request.CourseRequest;
import com.example.sms.dto.response.CourseResponse;
import com.example.sms.exception.ResourceNotFoundException;
import com.example.sms.model.Course;
import com.example.sms.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::convertToCourseResponse)
                .collect(Collectors.toList());
    }

    public CourseResponse getCourseById(String id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        return convertToCourseResponse(course);
    }

    public CourseResponse createCourse(CourseRequest request) {
        Course course = new Course();
        course.setName(request.getName());
        course.setCode(request.getCode());
        course.setDescription(request.getDescription());
        course.setSubjects(request.getSubjects());
        course.setDuration(request.getDuration());

        Course savedCourse = courseRepository.save(course);
        return convertToCourseResponse(savedCourse);
    }

    public CourseResponse updateCourse(String id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        course.setName(request.getName());
        course.setCode(request.getCode());
        course.setDescription(request.getDescription());
        course.setSubjects(request.getSubjects());
        course.setDuration(request.getDuration());

        Course updatedCourse = courseRepository.save(course);
        return convertToCourseResponse(updatedCourse);
    }

    public void deleteCourse(String id) {
        // Check if course exists
        courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        
        // Delete the course
        courseRepository.deleteById(id);
    }

    private CourseResponse convertToCourseResponse(Course course) {
        return new CourseResponse(
                course.getId(),
                course.getName(),
                course.getCode(),
                course.getDescription(),
                Arrays.asList(course.getSubjects()),  // Convert String[] to List<String>
                course.getDuration()
        );
    }
}