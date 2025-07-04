package com.islandscholars.controller;

import com.islandscholars.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/activity")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ActivityController {
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private OrganizationRepository organizationRepository;
    
    @Autowired
    private UniversityRepository universityRepository;
    
    @GetMapping("/stats/student/{studentId}")
    public ResponseEntity<Map<String, Object>> getStudentStats(@PathVariable Long studentId) {
        Map<String, Object> stats = new HashMap<>();
        
        int totalApplications = applicationRepository.findByStudentId(studentId).size();
        int acceptedApplications = (int) applicationRepository.findByStudentId(studentId)
            .stream()
            .filter(app -> "accepted".equalsIgnoreCase(app.getStatus()))
            .count();
        int rejectedApplications = (int) applicationRepository.findByStudentId(studentId)
            .stream()
            .filter(app -> "rejected".equalsIgnoreCase(app.getStatus()))
            .count();
        int pendingApplications = (int) applicationRepository.findByStudentId(studentId)
            .stream()
            .filter(app -> "pending".equalsIgnoreCase(app.getStatus()))
            .count();
        
        stats.put("totalApplications", totalApplications);
        stats.put("acceptedApplications", acceptedApplications);
        stats.put("rejectedApplications", rejectedApplications);
        stats.put("pendingApplications", pendingApplications);
        stats.put("successRate", totalApplications > 0 ? (acceptedApplications * 100.0 / totalApplications) : 0);
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/stats/organization/{organizationId}")
    public ResponseEntity<Map<String, Object>> getOrganizationStats(@PathVariable Long organizationId) {
        Map<String, Object> stats = new HashMap<>();
        
        int totalApplicationsReceived = applicationRepository.findByInternshipOrganizationId(organizationId).size() +
                                      applicationRepository.findByOrganizationIdAndInternshipIsNull(organizationId).size();
        
        int acceptedStudents = (int) applicationRepository.findByInternshipOrganizationId(organizationId)
            .stream()
            .filter(app -> "accepted".equalsIgnoreCase(app.getStatus()))
            .count() +
            (int) applicationRepository.findByOrganizationIdAndInternshipIsNull(organizationId)
            .stream()
            .filter(app -> "accepted".equalsIgnoreCase(app.getStatus()))
            .count();
        
        stats.put("totalApplicationsReceived", totalApplicationsReceived);
        stats.put("acceptedStudents", acceptedStudents);
        stats.put("acceptanceRate", totalApplicationsReceived > 0 ? (acceptedStudents * 100.0 / totalApplicationsReceived) : 0);
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/stats/university/{universityId}")
    public ResponseEntity<Map<String, Object>> getUniversityStats(@PathVariable Long universityId) {
        Map<String, Object> stats = new HashMap<>();
        
        int totalStudents = studentRepository.findByUniversityId(universityId).size();
        int studentsWithAcceptedApplications = (int) studentRepository.findByUniversityId(universityId)
            .stream()
            .filter(student -> applicationRepository.findByStudentId(student.getId())
                .stream()
                .anyMatch(app -> "accepted".equalsIgnoreCase(app.getStatus())))
            .count();
        
        int studentsWithSupervisors = (int) studentRepository.findByUniversityId(universityId)
            .stream()
            .filter(student -> student.getSupervisor() != null)
            .count();
        
        stats.put("totalStudents", totalStudents);
        stats.put("studentsWithAcceptedApplications", studentsWithAcceptedApplications);
        stats.put("studentsWithSupervisors", studentsWithSupervisors);
        stats.put("placementRate", totalStudents > 0 ? (studentsWithAcceptedApplications * 100.0 / totalStudents) : 0);
        
        return ResponseEntity.ok(stats);
    }
}