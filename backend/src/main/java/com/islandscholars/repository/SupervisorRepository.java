package com.islandscholars.repository;

import com.islandscholars.entity.Supervisor;
import com.islandscholars.entity.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface SupervisorRepository extends JpaRepository<Supervisor, Long> {
    Optional<Supervisor> findByUserId(Long userId);
    List<Supervisor> findByUniversity(University university);
    List<Supervisor> findByUniversityId(Long universityId);
}