package com.islandscholars.controller;

import com.islandscholars.entity.Application;
import com.islandscholars.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ApplicationController {
    
    @Autowired
    private ApplicationService applicationService;
    
    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {
        List<Application> applications = applicationService.getAllApplications();
        return ResponseEntity.ok(applications);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(@PathVariable Long id) {
        return applicationService.getApplicationById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Application>> getApplicationsByStudent(@PathVariable Long studentId) {
        List<Application> applications = applicationService.getApplicationsByStudent(studentId);
        return ResponseEntity.ok(applications);
    }
    
    @GetMapping("/internship/{internshipId}")
    public ResponseEntity<List<Application>> getApplicationsByInternship(@PathVariable Long internshipId) {
        List<Application> applications = applicationService.getApplicationsByInternship(internshipId);
        return ResponseEntity.ok(applications);
    }
    
    @GetMapping("/organization/{organizationId}")
    public ResponseEntity<List<Application>> getApplicationsByOrganization(@PathVariable Long organizationId) {
        List<Application> applications = applicationService.getApplicationsByOrganization(organizationId);
        return ResponseEntity.ok(applications);
    }
    
    @GetMapping("/organization/{organizationId}/direct")
    public ResponseEntity<List<Application>> getDirectApplicationsByOrganization(@PathVariable Long organizationId) {
        List<Application> applications = applicationService.getDirectApplicationsByOrganization(organizationId);
        return ResponseEntity.ok(applications);
    }
    
    @GetMapping("/organization/{organizationId}/all")
    public ResponseEntity<List<Application>> getAllApplicationsByOrganization(@PathVariable Long organizationId) {
        List<Application> applications = applicationService.getAllApplicationsByOrganization(organizationId);
        return ResponseEntity.ok(applications);
    }
    
    @GetMapping("/university/{universityId}")
    public ResponseEntity<List<Application>> getApplicationsByUniversity(@PathVariable Long universityId) {
        List<Application> applications = applicationService.getApplicationsByUniversity(universityId);
        return ResponseEntity.ok(applications);
    }
    
    @PostMapping
    public ResponseEntity<?> createApplication(@RequestBody Map<String, Object> applicationData) {
        try {
            Application createdApplication = applicationService.createApplicationFromMap(applicationData);
            return ResponseEntity.ok(createdApplication);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/accept")
    public ResponseEntity<Application> acceptApplication(@PathVariable Long id) {
        try {
            Application application = applicationService.acceptApplication(id);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/reject")
    public ResponseEntity<Application> rejectApplication(@PathVariable Long id) {
        try {
            Application application = applicationService.rejectApplication(id);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        return ResponseEntity.ok().build();
    }
}