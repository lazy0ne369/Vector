package com.vector.service.atlas;

import com.vector.dto.atlas.DeadlineDTO;
import com.vector.exception.ResourceNotFoundException;
import com.vector.model.User;
import com.vector.model.atlas.Course;
import com.vector.model.atlas.Deadline;
import com.vector.repository.atlas.CourseRepository;
import com.vector.repository.atlas.DeadlineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeadlineService {

    private final DeadlineRepository deadlineRepository;
    private final CourseRepository courseRepository;

    public List<DeadlineDTO> getAllDeadlinesByUser(Long userId) {
        return deadlineRepository.findByUserIdOrderByDueDateAsc(userId)
                .stream()
                .map(DeadlineDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<DeadlineDTO> getDeadlinesByCompletionStatus(Long userId, boolean isCompleted) {
        return deadlineRepository.findByUserIdAndIsCompletedOrderByDueDateAsc(userId, isCompleted)
                .stream()
                .map(DeadlineDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public DeadlineDTO getDeadlineById(Long deadlineId, Long userId) {
        Deadline deadline = deadlineRepository.findByIdAndUserId(deadlineId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Deadline not found"));
        return DeadlineDTO.fromEntity(deadline);
    }

    public List<DeadlineDTO> getDeadlinesByCourse(Long userId, Long courseId) {
        return deadlineRepository.findByUserIdAndCourseId(userId, courseId)
                .stream()
                .map(DeadlineDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<DeadlineDTO> getUpcomingDeadlines(Long userId) {
        return deadlineRepository.findUpcomingByUserId(userId, LocalDate.now())
                .stream()
                .map(DeadlineDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<DeadlineDTO> getDeadlinesDueWithinDays(Long userId, int days) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(days);
        return deadlineRepository.findByUserIdAndDueDateBetween(userId, today, endDate)
                .stream()
                .map(DeadlineDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<DeadlineDTO> getOverdueDeadlines(Long userId) {
        return deadlineRepository.findOverdueByUserId(userId, LocalDate.now())
                .stream()
                .map(DeadlineDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public DeadlineDTO createDeadline(DeadlineDTO deadlineDTO, User user) {
        Deadline deadline = deadlineDTO.toEntity();
        deadline.setUser(user);

        // Link to course if provided
        if (deadlineDTO.getCourseId() != null) {
            Course course = courseRepository.findByIdAndUserId(deadlineDTO.getCourseId(), user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
            deadline.setCourse(course);
        }

        Deadline savedDeadline = deadlineRepository.save(deadline);
        return DeadlineDTO.fromEntity(savedDeadline);
    }

    @Transactional
    public DeadlineDTO updateDeadline(Long deadlineId, DeadlineDTO deadlineDTO, Long userId) {
        Deadline deadline = deadlineRepository.findByIdAndUserId(deadlineId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Deadline not found"));

        // Update fields
        if (deadlineDTO.getTitle() != null)
            deadline.setTitle(deadlineDTO.getTitle());
        if (deadlineDTO.getDescription() != null)
            deadline.setDescription(deadlineDTO.getDescription());
        if (deadlineDTO.getDueDate() != null)
            deadline.setDueDate(deadlineDTO.getDueDate());
        if (deadlineDTO.getDueTime() != null)
            deadline.setDueTime(deadlineDTO.getDueTime());
        if (deadlineDTO.getPriority() != null)
            deadline.setPriority(deadlineDTO.getPriority());
        if (deadlineDTO.getType() != null)
            deadline.setType(deadlineDTO.getType());
        deadline.setReminderEnabled(deadlineDTO.isReminderEnabled());
        if (deadlineDTO.getReminderDaysBefore() != null) {
            deadline.setReminderDaysBefore(deadlineDTO.getReminderDaysBefore());
        }

        // Update course link
        if (deadlineDTO.getCourseId() != null) {
            Course course = courseRepository.findByIdAndUserId(deadlineDTO.getCourseId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
            deadline.setCourse(course);
        } else {
            deadline.setCourse(null);
        }

        Deadline updatedDeadline = deadlineRepository.save(deadline);
        return DeadlineDTO.fromEntity(updatedDeadline);
    }

    @Transactional
    public DeadlineDTO toggleCompletion(Long deadlineId, Long userId) {
        Deadline deadline = deadlineRepository.findByIdAndUserId(deadlineId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Deadline not found"));

        deadline.setCompleted(!deadline.isCompleted());
        deadline.setCompletedAt(deadline.isCompleted() ? LocalDateTime.now() : null);

        Deadline updatedDeadline = deadlineRepository.save(deadline);
        return DeadlineDTO.fromEntity(updatedDeadline);
    }

    @Transactional
    public void deleteDeadline(Long deadlineId, Long userId) {
        Deadline deadline = deadlineRepository.findByIdAndUserId(deadlineId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Deadline not found"));
        deadlineRepository.delete(deadline);
    }

    public List<DeadlineDTO> searchDeadlines(Long userId, String query) {
        return deadlineRepository.searchByUserIdAndQuery(userId, query)
                .stream()
                .map(DeadlineDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public long countUpcomingThisWeek(Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
        LocalDate endOfWeek = today.with(TemporalAdjusters.nextOrSame(java.time.DayOfWeek.SUNDAY));
        return deadlineRepository.countUpcomingThisWeek(userId, startOfWeek, endOfWeek);
    }

    public long countByPriority(Long userId, Deadline.Priority priority) {
        return deadlineRepository.countByUserIdAndPriorityAndIsCompleted(userId, priority, false);
    }

    public java.util.Map<String, Object> getDeadlineStats(Long userId) {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        LocalDate today = LocalDate.now();

        stats.put("total", deadlineRepository.findByUserIdOrderByDueDateAsc(userId).size());
        stats.put("pending", deadlineRepository.findByUserIdAndIsCompletedOrderByDueDateAsc(userId, false).size());
        stats.put("completed", deadlineRepository.findByUserIdAndIsCompletedOrderByDueDateAsc(userId, true).size());
        stats.put("overdue", deadlineRepository.findOverdueByUserId(userId, today).size());
        stats.put("dueThisWeek", countUpcomingThisWeek(userId));
        stats.put("highPriority", countByPriority(userId, Deadline.Priority.HIGH));

        return stats;
    }
}
