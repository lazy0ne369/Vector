package com.vector.controller.atlas;

import com.vector.dto.atlas.CourseDTO;
import com.vector.model.User;
import com.vector.model.atlas.Course;
import com.vector.service.AuthService;
import com.vector.service.atlas.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/atlas/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<CourseDTO> courses = courseService.getAllCoursesByUser(user.getId());
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourseById(
            @PathVariable Long id,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        CourseDTO course = courseService.getCourseById(id, user.getId());
        return ResponseEntity.ok(course);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CourseDTO>> getCoursesByStatus(
            @PathVariable Course.Status status,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<CourseDTO> courses = courseService.getCoursesByStatus(user.getId(), status);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/semester/{semester}")
    public ResponseEntity<List<CourseDTO>> getCoursesBySemester(
            @PathVariable String semester,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<CourseDTO> courses = courseService.getCoursesBySemester(user.getId(), semester);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/search")
    public ResponseEntity<List<CourseDTO>> searchCourses(
            @RequestParam String query,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<CourseDTO> courses = courseService.searchCourses(user.getId(), query);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/semesters")
    public ResponseEntity<List<String>> getAllSemesters(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<String> semesters = courseService.getAllSemesters(user.getId());
        return ResponseEntity.ok(semesters);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCourseStats(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        Map<String, Object> stats = courseService.getCourseStats(user.getId());
        return ResponseEntity.ok(stats);
    }

    @PostMapping
    public ResponseEntity<CourseDTO> createCourse(
            @Valid @RequestBody CourseDTO courseDTO,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        CourseDTO createdCourse = courseService.createCourse(courseDTO, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseDTO> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseDTO courseDTO,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        CourseDTO updatedCourse = courseService.updateCourse(id, courseDTO, user.getId());
        return ResponseEntity.ok(updatedCourse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(
            @PathVariable Long id,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        courseService.deleteCourse(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
