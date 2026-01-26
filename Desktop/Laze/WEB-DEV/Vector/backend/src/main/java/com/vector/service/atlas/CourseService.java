package com.vector.service.atlas;

import com.vector.dto.atlas.CourseDTO;
import com.vector.exception.ResourceNotFoundException;
import com.vector.model.User;
import com.vector.model.atlas.Course;
import com.vector.repository.atlas.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    public List<CourseDTO> getAllCoursesByUser(Long userId) {
        return courseRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> getCoursesByStatus(Long userId, Course.Status status) {
        return courseRepository.findByUserIdAndStatus(userId, status)
                .stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> getCoursesBySemester(Long userId, String semester) {
        return courseRepository.findByUserIdAndSemester(userId, semester)
                .stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public CourseDTO getCourseById(Long courseId, Long userId) {
        Course course = courseRepository.findByIdAndUserId(courseId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        return CourseDTO.fromEntity(course);
    }

    @Transactional
    public CourseDTO createCourse(CourseDTO courseDTO, User user) {
        Course course = courseDTO.toEntity();
        course.setUser(user);
        Course savedCourse = courseRepository.save(course);
        return CourseDTO.fromEntity(savedCourse);
    }

    @Transactional
    public CourseDTO updateCourse(Long courseId, CourseDTO courseDTO, Long userId) {
        Course course = courseRepository.findByIdAndUserId(courseId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Update fields
        if (courseDTO.getName() != null)
            course.setName(courseDTO.getName());
        if (courseDTO.getCourseCode() != null)
            course.setCourseCode(courseDTO.getCourseCode());
        if (courseDTO.getInstructor() != null)
            course.setInstructor(courseDTO.getInstructor());
        if (courseDTO.getCredits() != null)
            course.setCredits(courseDTO.getCredits());
        if (courseDTO.getSemester() != null)
            course.setSemester(courseDTO.getSemester());
        if (courseDTO.getColor() != null)
            course.setColor(courseDTO.getColor());
        if (courseDTO.getStatus() != null)
            course.setStatus(courseDTO.getStatus());
        if (courseDTO.getCurrentGrade() != null)
            course.setCurrentGrade(courseDTO.getCurrentGrade());
        if (courseDTO.getTargetGrade() != null)
            course.setTargetGrade(courseDTO.getTargetGrade());

        Course updatedCourse = courseRepository.save(course);
        return CourseDTO.fromEntity(updatedCourse);
    }

    @Transactional
    public void deleteCourse(Long courseId, Long userId) {
        Course course = courseRepository.findByIdAndUserId(courseId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        courseRepository.delete(course);
    }

    public List<CourseDTO> searchCourses(Long userId, String query) {
        return courseRepository.searchByUserIdAndQuery(userId, query)
                .stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Integer getTotalCredits(Long userId) {
        Integer credits = courseRepository.getTotalCreditsInProgress(userId);
        return credits != null ? credits : 0;
    }

    public List<String> getAllSemesters(Long userId) {
        return courseRepository.findDistinctSemestersByUserId(userId);
    }

    public long getCoursesCount(Long userId, Course.Status status) {
        return courseRepository.countByUserIdAndStatus(userId, status);
    }

    public java.util.Map<String, Object> getCourseStats(Long userId) {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalCourses", courseRepository.findByUserIdOrderByCreatedAtDesc(userId).size());
        stats.put("inProgress", courseRepository.countByUserIdAndStatus(userId, Course.Status.IN_PROGRESS));
        stats.put("completed", courseRepository.countByUserIdAndStatus(userId, Course.Status.COMPLETED));
        stats.put("dropped", courseRepository.countByUserIdAndStatus(userId, Course.Status.DROPPED));
        stats.put("totalCredits", getTotalCredits(userId));
        stats.put("semesters", getAllSemesters(userId));
        return stats;
    }
}
