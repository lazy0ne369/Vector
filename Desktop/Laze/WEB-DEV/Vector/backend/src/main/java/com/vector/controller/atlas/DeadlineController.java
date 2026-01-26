package com.vector.controller.atlas;

import com.vector.dto.atlas.DeadlineDTO;
import com.vector.model.User;
import com.vector.service.AuthService;
import com.vector.service.atlas.DeadlineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/atlas/deadlines")
@RequiredArgsConstructor
public class DeadlineController {

    private final DeadlineService deadlineService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<DeadlineDTO>> getAllDeadlines(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<DeadlineDTO> deadlines = deadlineService.getAllDeadlinesByUser(user.getId());
        return ResponseEntity.ok(deadlines);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeadlineDTO> getDeadlineById(
            @PathVariable Long id,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        DeadlineDTO deadline = deadlineService.getDeadlineById(id, user.getId());
        return ResponseEntity.ok(deadline);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<DeadlineDTO>> getPendingDeadlines(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<DeadlineDTO> deadlines = deadlineService.getDeadlinesByCompletionStatus(user.getId(), false);
        return ResponseEntity.ok(deadlines);
    }

    @GetMapping("/completed")
    public ResponseEntity<List<DeadlineDTO>> getCompletedDeadlines(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<DeadlineDTO> deadlines = deadlineService.getDeadlinesByCompletionStatus(user.getId(), true);
        return ResponseEntity.ok(deadlines);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<DeadlineDTO>> getUpcomingDeadlines(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<DeadlineDTO> deadlines = deadlineService.getUpcomingDeadlines(user.getId());
        return ResponseEntity.ok(deadlines);
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<DeadlineDTO>> getOverdueDeadlines(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<DeadlineDTO> deadlines = deadlineService.getOverdueDeadlines(user.getId());
        return ResponseEntity.ok(deadlines);
    }

    @GetMapping("/due-within/{days}")
    public ResponseEntity<List<DeadlineDTO>> getDeadlinesDueWithinDays(
            @PathVariable int days,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<DeadlineDTO> deadlines = deadlineService.getDeadlinesDueWithinDays(user.getId(), days);
        return ResponseEntity.ok(deadlines);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<DeadlineDTO>> getDeadlinesByCourse(
            @PathVariable Long courseId,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<DeadlineDTO> deadlines = deadlineService.getDeadlinesByCourse(user.getId(), courseId);
        return ResponseEntity.ok(deadlines);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDeadlineStats(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        Map<String, Object> stats = deadlineService.getDeadlineStats(user.getId());
        return ResponseEntity.ok(stats);
    }

    @PostMapping
    public ResponseEntity<DeadlineDTO> createDeadline(
            @Valid @RequestBody DeadlineDTO deadlineDTO,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        DeadlineDTO createdDeadline = deadlineService.createDeadline(deadlineDTO, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDeadline);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeadlineDTO> updateDeadline(
            @PathVariable Long id,
            @Valid @RequestBody DeadlineDTO deadlineDTO,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        DeadlineDTO updatedDeadline = deadlineService.updateDeadline(id, deadlineDTO, user.getId());
        return ResponseEntity.ok(updatedDeadline);
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<DeadlineDTO> toggleDeadlineCompletion(
            @PathVariable Long id,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        DeadlineDTO toggledDeadline = deadlineService.toggleCompletion(id, user.getId());
        return ResponseEntity.ok(toggledDeadline);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeadline(
            @PathVariable Long id,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        deadlineService.deleteDeadline(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
