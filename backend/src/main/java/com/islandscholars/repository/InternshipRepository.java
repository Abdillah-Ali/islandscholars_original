package com.islandscholars.repository;

import com.islandscholars.entity.Internship;
import com.islandscholars.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {
    List<Internship> findByOrganization(Organization organization);
    List<Internship> findByOrganizationId(Long organizationId);
    List<Internship> findByStatus(String status);
    List<Internship> findByField(String field);
    List<Internship> findByLocation(String location);
    List<Internship> findByType(String type);
}