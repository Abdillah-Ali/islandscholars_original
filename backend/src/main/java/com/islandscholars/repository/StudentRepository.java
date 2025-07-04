package com.islandscholars.repository;

import com.islandscholars.entity.Student;
import com.islandscholars.entity.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    List<Student> findByUniversity(University university);
    List<Student> findByUniversityId(Long universityId);
    Optional<Student> findByStudentId(String studentId);
    boolean existsByStudentId(String studentId);
}