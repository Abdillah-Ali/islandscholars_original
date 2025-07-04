package com.islandscholars.controller;

import com.islandscholars.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private OrganizationRepository organizationRepository;
    
    @Autowired
    private UniversityRepository universityRepository;
    
    @Autowired
    private InternshipRepository internshipRepository;
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalStudents", studentRepository.count());
        stats.put("totalOrganizations", organizationRepository.count());
        stats.put("totalUniversities", universityRepository.count());
        stats.put("totalInternships", internshipRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("activeInternships", internshipRepository.findByStatus("active").size());
        stats.put("pendingApplications", applicationRepository.findByStatus("pending").size());
        stats.put("completedInternships", applicationRepository.findByStatus("accepted").size());
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/recent-activity")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivity() {
        List<Map<String, Object>> activities = new ArrayList<>();
        
        Map<String, Object> activity1 = new HashMap<>();
        activity1.put("description", "New student registration");
        activity1.put("timestamp", "2 hours ago");
        activities.add(activity1);
        
        Map<String, Object> activity2 = new HashMap<>();
        activity2.put("description", "New internship posted");
        activity2.put("timestamp", "4 hours ago");
        activities.add(activity2);
        
        Map<String, Object> activity3 = new HashMap<>();
        activity3.put("description", "Application submitted");
        activity3.put("timestamp", "6 hours ago");
        activities.add(activity3);
        
        return ResponseEntity.ok(activities);
    }
    
    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> generateReports() {
        Map<String, Object> reports = new HashMap<>();
        
        reports.put("monthlyRegistrations", 45);
        reports.put("monthlyApplications", 120);
        reports.put("successRate", 78.5);
        reports.put("topUniversities", List.of("UDSM", "SUZA", "SUA"));
        
        return ResponseEntity.ok(reports);
    }
}