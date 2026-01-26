package com.vector.repository.atlas;

import com.vector.model.atlas.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Course> findByUserIdAndStatus(Long userId, Course.Status status);

    List<Course> findByUserIdAndSemester(Long userId, String semester);

    Optional<Course> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT c FROM Course c WHERE c.user.id = :userId AND " +
            "(LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.courseCode) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Course> searchByUserIdAndQuery(@Param("userId") Long userId, @Param("query") String query);

    @Query("SELECT SUM(c.credits) FROM Course c WHERE c.user.id = :userId AND c.status = 'IN_PROGRESS'")
    Integer getTotalCreditsInProgress(@Param("userId") Long userId);

    @Query("SELECT DISTINCT c.semester FROM Course c WHERE c.user.id = :userId ORDER BY c.semester DESC")
    List<String> findDistinctSemestersByUserId(@Param("userId") Long userId);

    long countByUserIdAndStatus(Long userId, Course.Status status);
}
