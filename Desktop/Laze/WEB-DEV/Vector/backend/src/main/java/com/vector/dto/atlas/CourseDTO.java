package com.vector.dto.atlas;

import com.vector.model.atlas.Course;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {

    private Long id;

    @NotBlank(message = "Course name is required")
    private String name;

    private String courseCode;

    private String instructor;

    @Positive(message = "Credits must be positive")
    private Integer credits;

    private String semester;

    private String color;

    private Course.Status status;

    private String currentGrade;

    private String targetGrade;

    private int deadlineCount;

    private int pendingDeadlines;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Convert Entity to DTO
    public static CourseDTO fromEntity(Course course) {
        return CourseDTO.builder()
                .id(course.getId())
                .name(course.getName())
                .courseCode(course.getCourseCode())
                .instructor(course.getInstructor())
                .credits(course.getCredits())
                .semester(course.getSemester())
                .color(course.getColor())
                .status(course.getStatus())
                .currentGrade(course.getCurrentGrade())
                .targetGrade(course.getTargetGrade())
                .deadlineCount(course.getDeadlines() != null ? course.getDeadlines().size() : 0)
                .pendingDeadlines(course.getDeadlines() != null
                        ? (int) course.getDeadlines().stream().filter(d -> !d.isCompleted()).count()
                        : 0)
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }

    // Convert DTO to Entity (for create/update)
    public Course toEntity() {
        return Course.builder()
                .name(this.name)
                .courseCode(this.courseCode)
                .instructor(this.instructor)
                .credits(this.credits)
                .semester(this.semester)
                .color(this.color)
                .status(this.status != null ? this.status : Course.Status.IN_PROGRESS)
                .currentGrade(this.currentGrade)
                .targetGrade(this.targetGrade)
                .build();
    }
}
