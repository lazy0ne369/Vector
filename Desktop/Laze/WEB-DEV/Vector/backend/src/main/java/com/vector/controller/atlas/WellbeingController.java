package com.vector.controller.atlas;

import com.vector.dto.atlas.WellbeingCheckInDTO;
import com.vector.model.User;
import com.vector.service.AuthService;
import com.vector.service.atlas.WellbeingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/atlas/wellbeing")
@RequiredArgsConstructor
public class WellbeingController {

    private final WellbeingService wellbeingService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<WellbeingCheckInDTO>> getAllCheckIns(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<WellbeingCheckInDTO> checkIns = wellbeingService.getAllCheckInsByUser(user.getId());
        return ResponseEntity.ok(checkIns);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WellbeingCheckInDTO> getCheckInById(
            @PathVariable Long id,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        WellbeingCheckInDTO checkIn = wellbeingService.getCheckInById(id, user.getId());
        return ResponseEntity.ok(checkIn);
    }

    @GetMapping("/today")
    public ResponseEntity<WellbeingCheckInDTO> getTodayCheckIn(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        WellbeingCheckInDTO checkIn = wellbeingService.getTodayCheckIn(user.getId());
        return ResponseEntity.ok(checkIn);
    }

    @GetMapping("/week")
    public ResponseEntity<List<WellbeingCheckInDTO>> getWeeklyCheckIns(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<WellbeingCheckInDTO> checkIns = wellbeingService.getWeeklyCheckIns(user.getId());
        return ResponseEntity.ok(checkIns);
    }

    @GetMapping("/month")
    public ResponseEntity<List<WellbeingCheckInDTO>> getMonthlyCheckIns(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<WellbeingCheckInDTO> checkIns = wellbeingService.getMonthlyCheckIns(user.getId());
        return ResponseEntity.ok(checkIns);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getWellbeingStats(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        Map<String, Object> stats = wellbeingService.getWellbeingStats(user.getId());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/streak")
    public ResponseEntity<Map<String, Object>> getCheckInStreak(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        Map<String, Object> streak = wellbeingService.getCheckInStreak(user.getId());
        return ResponseEntity.ok(streak);
    }

    @PostMapping
    public ResponseEntity<WellbeingCheckInDTO> createCheckIn(
            @Valid @RequestBody WellbeingCheckInDTO checkInDTO,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        WellbeingCheckInDTO createdCheckIn = wellbeingService.createCheckIn(checkInDTO, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCheckIn);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WellbeingCheckInDTO> updateCheckIn(
            @PathVariable Long id,
            @Valid @RequestBody WellbeingCheckInDTO checkInDTO,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        WellbeingCheckInDTO updatedCheckIn = wellbeingService.updateCheckIn(id, checkInDTO, user.getId());
        return ResponseEntity.ok(updatedCheckIn);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCheckIn(
            @PathVariable Long id,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        wellbeingService.deleteCheckIn(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
