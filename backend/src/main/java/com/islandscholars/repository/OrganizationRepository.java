package com.islandscholars.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.islandscholars.entity.Organization;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByEmail(String email);
    List<Organization> findByIndustry(String industry);
    List<Organization> findByLocation(String location);
    boolean existsByEmail(String email);
    long countByName(String name);
}
