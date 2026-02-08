package com.vector.service.atlas;

import com.vector.dto.atlas.WellbeingCheckInDTO;
import com.vector.exception.ResourceNotFoundException;
import com.vector.model.User;
import com.vector.model.atlas.WellbeingCheckIn;
import com.vector.repository.atlas.WellbeingCheckInRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WellbeingService {

    private final WellbeingCheckInRepository wellbeingRepository;

    public List<WellbeingCheckInDTO> getAllCheckInsByUser(Long userId) {
        return wellbeingRepository.findByUserIdOrderByCheckDateDesc(userId)
                .stream()
                .map(WellbeingCheckInDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public WellbeingCheckInDTO getCheckInById(Long checkInId, Long userId) {
        WellbeingCheckIn checkIn = wellbeingRepository.findByIdAndUserId(checkInId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Check-in not found"));
        return WellbeingCheckInDTO.fromEntity(checkIn);
    }

    public WellbeingCheckInDTO getTodayCheckIn(Long userId) {
        return wellbeingRepository.findByUserIdAndCheckDate(userId, LocalDate.now())
                .map(WellbeingCheckInDTO::fromEntity)
                .orElse(null);
    }

    public List<WellbeingCheckInDTO> getWeeklyCheckIns(Long userId) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(7);
        return wellbeingRepository.findByUserIdAndCheckDateBetweenOrderByCheckDateDesc(userId, startDate, endDate)
                .stream()
                .map(WellbeingCheckInDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<WellbeingCheckInDTO> getMonthlyCheckIns(Long userId) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(30);
        return wellbeingRepository.findByUserIdAndCheckDateBetweenOrderByCheckDateDesc(userId, startDate, endDate)
                .stream()
                .map(WellbeingCheckInDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<WellbeingCheckInDTO> getCheckInsInRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return wellbeingRepository.findByUserIdAndCheckDateBetweenOrderByCheckDateDesc(userId, startDate, endDate)
                .stream()
                .map(WellbeingCheckInDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<WellbeingCheckInDTO> getLatestCheckIns(Long userId, int limit) {
        return wellbeingRepository.findLatestByUserId(userId, org.springframework.data.domain.PageRequest.of(0, limit))
                .stream()
                .map(WellbeingCheckInDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public WellbeingCheckInDTO createCheckIn(WellbeingCheckInDTO checkInDTO, User user) {
        // Check if there's already a check-in for this date
        if (wellbeingRepository.existsByUserIdAndCheckDate(user.getId(), checkInDTO.getCheckDate())) {
            throw new IllegalArgumentException("Check-in already exists for this date. Use update instead.");
        }

        WellbeingCheckIn checkIn = checkInDTO.toEntity();
        checkIn.setUser(user);
        WellbeingCheckIn savedCheckIn = wellbeingRepository.save(checkIn);
        return WellbeingCheckInDTO.fromEntity(savedCheckIn);
    }

    @Transactional
    public WellbeingCheckInDTO updateCheckIn(Long checkInId, WellbeingCheckInDTO checkInDTO, Long userId) {
        WellbeingCheckIn checkIn = wellbeingRepository.findByIdAndUserId(checkInId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Check-in not found"));

        if (checkInDTO.getStressLevel() != null)
            checkIn.setStressLevel(checkInDTO.getStressLevel());
        if (checkInDTO.getSleepQuality() != null)
            checkIn.setSleepQuality(checkInDTO.getSleepQuality());
        if (checkInDTO.getSleepHours() != null)
            checkIn.setSleepHours(checkInDTO.getSleepHours());
        if (checkInDTO.getEnergyLevel() != null)
            checkIn.setEnergyLevel(checkInDTO.getEnergyLevel());
        if (checkInDTO.getWorkloadLevel() != null)
            checkIn.setWorkloadLevel(checkInDTO.getWorkloadLevel());
        if (checkInDTO.getMoodLevel() != null)
            checkIn.setMoodLevel(checkInDTO.getMoodLevel());
        if (checkInDTO.getNotes() != null)
            checkIn.setNotes(checkInDTO.getNotes());

        WellbeingCheckIn savedCheckIn = wellbeingRepository.save(checkIn);
        return WellbeingCheckInDTO.fromEntity(savedCheckIn);
    }

    @Transactional
    public WellbeingCheckInDTO createOrUpdateCheckIn(WellbeingCheckInDTO checkInDTO, User user) {
        // Check if there's already a check-in for this date
        WellbeingCheckIn checkIn = wellbeingRepository
                .findByUserIdAndCheckDate(user.getId(), checkInDTO.getCheckDate())
                .orElse(null);

        if (checkIn == null) {
            // Create new
            checkIn = checkInDTO.toEntity();
            checkIn.setUser(user);
        } else {
            // Update existing
            if (checkInDTO.getStressLevel() != null)
                checkIn.setStressLevel(checkInDTO.getStressLevel());
            if (checkInDTO.getSleepQuality() != null)
                checkIn.setSleepQuality(checkInDTO.getSleepQuality());
            if (checkInDTO.getSleepHours() != null)
                checkIn.setSleepHours(checkInDTO.getSleepHours());
            if (checkInDTO.getEnergyLevel() != null)
                checkIn.setEnergyLevel(checkInDTO.getEnergyLevel());
            if (checkInDTO.getWorkloadLevel() != null)
                checkIn.setWorkloadLevel(checkInDTO.getWorkloadLevel());
            if (checkInDTO.getMoodLevel() != null)
                checkIn.setMoodLevel(checkInDTO.getMoodLevel());
            if (checkInDTO.getNotes() != null)
                checkIn.setNotes(checkInDTO.getNotes());
        }

        WellbeingCheckIn savedCheckIn = wellbeingRepository.save(checkIn);
        return WellbeingCheckInDTO.fromEntity(savedCheckIn);
    }

    @Transactional
    public void deleteCheckIn(Long checkInId, Long userId) {
        WellbeingCheckIn checkIn = wellbeingRepository.findByIdAndUserId(checkInId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Check-in not found"));
        wellbeingRepository.delete(checkIn);
    }

    public boolean hasCheckedInToday(Long userId) {
        return wellbeingRepository.existsByUserIdAndCheckDate(userId, LocalDate.now());
    }

    // Analytics methods
    public Double getAverageStressLevel(Long userId, int daysBack) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(daysBack);
        return wellbeingRepository.getAverageStressLevel(userId, startDate, endDate);
    }

    public Double getAverageSleepHours(Long userId, int daysBack) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(daysBack);
        return wellbeingRepository.getAverageSleepHours(userId, startDate, endDate);
    }

    public WellbeingStats getWeeklyStats(Long userId) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(7);

        long onTrack = wellbeingRepository.countByUserIdAndOverallStatusAndCheckDateBetween(
                userId, WellbeingCheckIn.OverallStatus.ON_TRACK, startDate, endDate);
        long needsAttention = wellbeingRepository.countByUserIdAndOverallStatusAndCheckDateBetween(
                userId, WellbeingCheckIn.OverallStatus.NEEDS_ATTENTION, startDate, endDate);
        long overloaded = wellbeingRepository.countByUserIdAndOverallStatusAndCheckDateBetween(
                userId, WellbeingCheckIn.OverallStatus.OVERLOADED, startDate, endDate);

        Double avgStress = wellbeingRepository.getAverageStressLevel(userId, startDate, endDate);
        Double avgSleep = wellbeingRepository.getAverageSleepHours(userId, startDate, endDate);

        return new WellbeingStats(onTrack, needsAttention, overloaded, avgStress, avgSleep);
    }

    public record WellbeingStats(
            long onTrackDays,
            long needsAttentionDays,
            long overloadedDays,
            Double averageStressLevel,
            Double averageSleepHours) {
    }

    public java.util.Map<String, Object> getWellbeingStats(Long userId) {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(30);

        Double avgStress = wellbeingRepository.getAverageStressLevel(userId, startDate, endDate);
        Double avgSleep = wellbeingRepository.getAverageSleepHours(userId, startDate, endDate);

        long onTrack = wellbeingRepository.countByUserIdAndOverallStatusAndCheckDateBetween(
                userId, WellbeingCheckIn.OverallStatus.ON_TRACK, startDate, endDate);
        long needsAttention = wellbeingRepository.countByUserIdAndOverallStatusAndCheckDateBetween(
                userId, WellbeingCheckIn.OverallStatus.NEEDS_ATTENTION, startDate, endDate);
        long overloaded = wellbeingRepository.countByUserIdAndOverallStatusAndCheckDateBetween(
                userId, WellbeingCheckIn.OverallStatus.OVERLOADED, startDate, endDate);

        stats.put("averageStressLevel", avgStress != null ? avgStress : 0);
        stats.put("averageSleepHours", avgSleep != null ? avgSleep : 0);
        stats.put("onTrackDays", onTrack);
        stats.put("needsAttentionDays", needsAttention);
        stats.put("overloadedDays", overloaded);
        stats.put("totalCheckIns", onTrack + needsAttention + overloaded);
        stats.put("hasCheckedInToday", hasCheckedInToday(userId));

        return stats;
    }

    public java.util.Map<String, Object> getCheckInStreak(Long userId) {
        java.util.Map<String, Object> streak = new java.util.HashMap<>();

        List<WellbeingCheckIn> checkIns = wellbeingRepository.findByUserIdOrderByCheckDateDesc(userId);

        int currentStreak = 0;
        int longestStreak = 0;
        int tempStreak = 0;
        LocalDate today = LocalDate.now();
        LocalDate expectedDate = today;

        for (WellbeingCheckIn checkIn : checkIns) {
            LocalDate checkDate = checkIn.getCheckDate();

            if (checkDate.equals(expectedDate)) {
                tempStreak++;
                expectedDate = expectedDate.minusDays(1);
            } else if (checkDate.isBefore(expectedDate)) {
                if (tempStreak > longestStreak) {
                    longestStreak = tempStreak;
                }
                tempStreak = 1;
                expectedDate = checkDate.minusDays(1);
            }

            if (currentStreak == 0 && (checkDate.equals(today) || checkDate.equals(today.minusDays(1)))) {
                currentStreak = tempStreak;
            }
        }

        if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
        }

        streak.put("currentStreak", currentStreak);
        streak.put("longestStreak", longestStreak);
        streak.put("hasCheckedInToday", hasCheckedInToday(userId));

        return streak;
    }
}
