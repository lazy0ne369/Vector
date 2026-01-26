package com.vector.repository.atlas;

import com.vector.model.atlas.Deadline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeadlineRepository extends JpaRepository<Deadline, Long> {

    List<Deadline> findByUserIdOrderByDueDateAsc(Long userId);

    List<Deadline> findByUserIdAndIsCompletedOrderByDueDateAsc(Long userId, boolean isCompleted);

    Optional<Deadline> findByIdAndUserId(Long id, Long userId);

    List<Deadline> findByCourseId(Long courseId);

    List<Deadline> findByUserIdAndCourseId(Long userId, Long courseId);

    // Get upcoming deadlines (not completed, due date >= today)
    @Query("SELECT d FROM Deadline d WHERE d.user.id = :userId AND d.isCompleted = false " +
            "AND d.dueDate >= :today ORDER BY d.dueDate ASC")
    List<Deadline> findUpcomingByUserId(@Param("userId") Long userId, @Param("today") LocalDate today);

    // Get deadlines due within X days
    @Query("SELECT d FROM Deadline d WHERE d.user.id = :userId AND d.isCompleted = false " +
            "AND d.dueDate BETWEEN :startDate AND :endDate ORDER BY d.dueDate ASC")
    List<Deadline> findByUserIdAndDueDateBetween(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    // Get overdue deadlines
    @Query("SELECT d FROM Deadline d WHERE d.user.id = :userId AND d.isCompleted = false " +
            "AND d.dueDate < :today ORDER BY d.dueDate ASC")
    List<Deadline> findOverdueByUserId(@Param("userId") Long userId, @Param("today") LocalDate today);

    // Search deadlines
    @Query("SELECT d FROM Deadline d WHERE d.user.id = :userId AND " +
            "LOWER(d.title) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Deadline> searchByUserIdAndQuery(@Param("userId") Long userId, @Param("query") String query);

    // Count by priority
    long countByUserIdAndPriorityAndIsCompleted(Long userId, Deadline.Priority priority, boolean isCompleted);

    // Count upcoming this week
    @Query("SELECT COUNT(d) FROM Deadline d WHERE d.user.id = :userId AND d.isCompleted = false " +
            "AND d.dueDate BETWEEN :startOfWeek AND :endOfWeek")
    long countUpcomingThisWeek(
            @Param("userId") Long userId,
            @Param("startOfWeek") LocalDate startOfWeek,
            @Param("endOfWeek") LocalDate endOfWeek);
}
