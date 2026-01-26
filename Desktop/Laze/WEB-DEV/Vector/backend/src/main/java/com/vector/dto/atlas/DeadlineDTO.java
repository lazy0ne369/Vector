package com.vector.dto.atlas;

import com.vector.model.atlas.Deadline;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeadlineDTO {

    private Long id;

    private Long courseId;

    private String courseName;

    private String courseCode;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    private String dueTime;

    private Deadline.Priority priority;

    private Deadline.Type type;

    private boolean isCompleted;

    private LocalDateTime completedAt;

    private boolean reminderEnabled;

    private Integer reminderDaysBefore;

    private boolean isOverdue;

    private int daysUntilDue;

    private LocalDateTime createdAt;

    // Convert Entity to DTO
    public static DeadlineDTO fromEntity(Deadline deadline) {
        LocalDate today = LocalDate.now();
        boolean overdue = !deadline.isCompleted() && deadline.getDueDate().isBefore(today);
        int daysUntil = (int) java.time.temporal.ChronoUnit.DAYS.between(today, deadline.getDueDate());

        return DeadlineDTO.builder()
                .id(deadline.getId())
                .courseId(deadline.getCourse() != null ? deadline.getCourse().getId() : null)
                .courseName(deadline.getCourse() != null ? deadline.getCourse().getName() : null)
                .courseCode(deadline.getCourse() != null ? deadline.getCourse().getCourseCode() : null)
                .title(deadline.getTitle())
                .description(deadline.getDescription())
                .dueDate(deadline.getDueDate())
                .dueTime(deadline.getDueTime())
                .priority(deadline.getPriority())
                .type(deadline.getType())
                .isCompleted(deadline.isCompleted())
                .completedAt(deadline.getCompletedAt())
                .reminderEnabled(deadline.isReminderEnabled())
                .reminderDaysBefore(deadline.getReminderDaysBefore())
                .isOverdue(overdue)
                .daysUntilDue(daysUntil)
                .createdAt(deadline.getCreatedAt())
                .build();
    }

    // Convert DTO to Entity
    public Deadline toEntity() {
        return Deadline.builder()
                .title(this.title)
                .description(this.description)
                .dueDate(this.dueDate)
                .dueTime(this.dueTime)
                .priority(this.priority != null ? this.priority : Deadline.Priority.MEDIUM)
                .type(this.type != null ? this.type : Deadline.Type.ASSIGNMENT)
                .isCompleted(this.isCompleted)
                .reminderEnabled(this.reminderEnabled)
                .reminderDaysBefore(this.reminderDaysBefore != null ? this.reminderDaysBefore : 1)
                .build();
    }
}
