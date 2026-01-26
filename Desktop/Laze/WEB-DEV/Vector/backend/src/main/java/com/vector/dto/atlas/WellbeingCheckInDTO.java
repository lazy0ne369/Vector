package com.vector.dto.atlas;

import com.vector.model.atlas.WellbeingCheckIn;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class WellbeingCheckInDTO {

    private Long id;

    @NotNull(message = "Check date is required")
    private LocalDate checkDate;

    @Min(value = 1, message = "Stress level must be between 1 and 5")
    @Max(value = 5, message = "Stress level must be between 1 and 5")
    private Integer stressLevel;

    @Min(value = 1, message = "Sleep quality must be between 1 and 5")
    @Max(value = 5, message = "Sleep quality must be between 1 and 5")
    private Integer sleepQuality;

    @Min(value = 0, message = "Sleep hours cannot be negative")
    @Max(value = 24, message = "Sleep hours cannot exceed 24")
    private Double sleepHours;

    @Min(value = 1, message = "Energy level must be between 1 and 5")
    @Max(value = 5, message = "Energy level must be between 1 and 5")
    private Integer energyLevel;

    @Min(value = 1, message = "Workload level must be between 1 and 5")
    @Max(value = 5, message = "Workload level must be between 1 and 5")
    private Integer workloadLevel;

    @Min(value = 1, message = "Mood level must be between 1 and 5")
    @Max(value = 5, message = "Mood level must be between 1 and 5")
    private Integer moodLevel;

    private WellbeingCheckIn.OverallStatus overallStatus;

    private String notes;

    private LocalDateTime createdAt;

    // Convert Entity to DTO
    public static WellbeingCheckInDTO fromEntity(WellbeingCheckIn checkIn) {
        return WellbeingCheckInDTO.builder()
                .id(checkIn.getId())
                .checkDate(checkIn.getCheckDate())
                .stressLevel(checkIn.getStressLevel())
                .sleepQuality(checkIn.getSleepQuality())
                .sleepHours(checkIn.getSleepHours())
                .energyLevel(checkIn.getEnergyLevel())
                .workloadLevel(checkIn.getWorkloadLevel())
                .moodLevel(checkIn.getMoodLevel())
                .overallStatus(checkIn.getOverallStatus())
                .notes(checkIn.getNotes())
                .createdAt(checkIn.getCreatedAt())
                .build();
    }

    // Convert DTO to Entity
    public WellbeingCheckIn toEntity() {
        return WellbeingCheckIn.builder()
                .checkDate(this.checkDate)
                .stressLevel(this.stressLevel)
                .sleepQuality(this.sleepQuality)
                .sleepHours(this.sleepHours)
                .energyLevel(this.energyLevel)
                .workloadLevel(this.workloadLevel)
                .moodLevel(this.moodLevel)
                .notes(this.notes)
                .build();
    }
}
