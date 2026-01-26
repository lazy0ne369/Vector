package com.vector.model.atlas;

import com.vector.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "wellbeing_checkins")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WellbeingCheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "check_date", nullable = false)
    private LocalDate checkDate;

    // Stress level: 1-5 (1 = very low, 5 = very high)
    @Column(name = "stress_level")
    private Integer stressLevel;

    // Sleep quality: 1-5 (1 = very poor, 5 = excellent)
    @Column(name = "sleep_quality")
    private Integer sleepQuality;

    // Sleep hours
    @Column(name = "sleep_hours")
    private Double sleepHours;

    // Energy level: 1-5
    @Column(name = "energy_level")
    private Integer energyLevel;

    // Workload perception: 1-5 (1 = very light, 5 = overwhelming)
    @Column(name = "workload_level")
    private Integer workloadLevel;

    // Mood: 1-5 (1 = very low, 5 = excellent)
    @Column(name = "mood_level")
    private Integer moodLevel;

    // Overall status derived from the above
    @Enumerated(EnumType.STRING)
    private OverallStatus overallStatus;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        calculateOverallStatus();
    }

    @PreUpdate
    protected void onUpdate() {
        calculateOverallStatus();
    }

    private void calculateOverallStatus() {
        double avgPositive = 0;
        double avgNegative = 0;
        int count = 0;

        // Positive indicators (higher is better)
        if (sleepQuality != null) {
            avgPositive += sleepQuality;
            count++;
        }
        if (energyLevel != null) {
            avgPositive += energyLevel;
            count++;
        }
        if (moodLevel != null) {
            avgPositive += moodLevel;
            count++;
        }

        // Negative indicators (higher is worse)
        if (stressLevel != null) {
            avgNegative += stressLevel;
        }
        if (workloadLevel != null) {
            avgNegative += workloadLevel;
        }

        if (count > 0) {
            avgPositive = avgPositive / count;
            avgNegative = avgNegative / 2;

            double score = avgPositive - (avgNegative * 0.5);

            if (score >= 3.5) {
                overallStatus = OverallStatus.ON_TRACK;
            } else if (score >= 2.0) {
                overallStatus = OverallStatus.NEEDS_ATTENTION;
            } else {
                overallStatus = OverallStatus.OVERLOADED;
            }
        }
    }

    public enum OverallStatus {
        ON_TRACK, // Green signal - doing well
        NEEDS_ATTENTION, // Yellow signal - some concerns
        OVERLOADED // Red signal - needs intervention
    }
}
