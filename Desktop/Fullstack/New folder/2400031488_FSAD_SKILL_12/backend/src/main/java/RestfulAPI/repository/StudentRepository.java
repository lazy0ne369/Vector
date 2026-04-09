package RestfulAPI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import RestfulAPI.model.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
}