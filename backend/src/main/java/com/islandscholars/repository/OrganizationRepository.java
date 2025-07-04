package com.islandscholars.repository;

import com.islandscholars.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByEmail(String email);
    List<Organization> findByIndustry(String industry);
    List<Organization> findByLocation(String location);
    boolean existsByEmail(String email);
}