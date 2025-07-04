package com.islandscholars.repository;

import com.islandscholars.entity.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UniversityRepository extends JpaRepository<University, Long> {
    Optional<University> findByEmail(String email);
    Optional<University> findByName(String name);
    boolean existsByEmail(String email);
    boolean existsByName(String name);
}