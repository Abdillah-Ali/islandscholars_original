package com.islandscholars.repository;

import com.islandscholars.entity.Application;
import com.islandscholars.entity.Student;
import com.islandscholars.entity.Internship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudent(Student student);
    List<Application> findByStudentId(Long studentId);
    List<Application> findByInternship(Internship internship);
    List<Application> findByInternshipId(Long internshipId);
    List<Application> findByStatus(String status);
    Optional<Application> findByStudentAndInternship(Student student, Internship internship);
    List<Application> findByInternshipOrganizationId(Long organizationId);
    List<Application> findByStudentUniversityId(Long universityId);
    List<Application> findByOrganizationIdAndInternshipIsNull(Long organizationId);
    
    @Query("SELECT a FROM Application a WHERE a.organization.id = :organizationId AND a.internship IS NULL")
    List<Application> findDirectApplicationsByOrganizationId(@Param("organizationId") Long organizationId);
    
    @Query("SELECT a FROM Application a WHERE a.internship.organization.id = :organizationId OR a.organization.id = :organizationId")
    List<Application> findAllApplicationsByOrganizationId(@Param("organizationId") Long organizationId);
}