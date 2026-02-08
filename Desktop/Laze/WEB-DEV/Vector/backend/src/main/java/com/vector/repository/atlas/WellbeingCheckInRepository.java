package com.vector.repository.atlas;

import com.vector.model.atlas.WellbeingCheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WellbeingCheckInRepository extends JpaRepository<WellbeingCheckIn, Long> {

        List<WellbeingCheckIn> findByUserIdOrderByCheckDateDesc(Long userId);

        Optional<WellbeingCheckIn> findByIdAndUserId(Long id, Long userId);

        Optional<WellbeingCheckIn> findByUserIdAndCheckDate(Long userId, LocalDate checkDate);

        // Get check-ins within date range
        List<WellbeingCheckIn> findByUserIdAndCheckDateBetweenOrderByCheckDateDesc(
                        Long userId, LocalDate startDate, LocalDate endDate);

        // Get latest N check-ins - use Pageable for proper limiting
        @Query("SELECT w FROM WellbeingCheckIn w WHERE w.user.id = :userId ORDER BY w.checkDate DESC")
        List<WellbeingCheckIn> findLatestByUserId(@Param("userId") Long userId,
                        org.springframework.data.domain.Pageable pageable);

        // Get average stress level for date range
        @Query("SELECT AVG(w.stressLevel) FROM WellbeingCheckIn w WHERE w.user.id = :userId " +
                        "AND w.checkDate BETWEEN :startDate AND :endDate")
        Double getAverageStressLevel(
                        @Param("userId") Long userId,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        // Get average sleep hours for date range
        @Query("SELECT AVG(w.sleepHours) FROM WellbeingCheckIn w WHERE w.user.id = :userId " +
                        "AND w.checkDate BETWEEN :startDate AND :endDate")
        Double getAverageSleepHours(
                        @Param("userId") Long userId,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        // Count by overall status in date range
        long countByUserIdAndOverallStatusAndCheckDateBetween(
                        Long userId,
                        WellbeingCheckIn.OverallStatus status,
                        LocalDate startDate,
                        LocalDate endDate);

        // Check if user has checked in today
        boolean existsByUserIdAndCheckDate(Long userId, LocalDate checkDate);
}
