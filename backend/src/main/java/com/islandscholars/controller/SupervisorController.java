package com.islandscholars.controller;

import com.islandscholars.entity.Supervisor;
import com.islandscholars.service.SupervisorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/supervisors")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class SupervisorController {
    
    @Autowired
    private SupervisorService supervisorService;
    
    @GetMapping
    public ResponseEntity<List<Supervisor>> getAllSupervisors() {
        List<Supervisor> supervisors = supervisorService.getAllSupervisors();
        return ResponseEntity.ok(supervisors);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Supervisor> getSupervisorById(@PathVariable Long id) {
        return supervisorService.getSupervisorById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/university/{universityId}")
    public ResponseEntity<List<Supervisor>> getSupervisorsByUniversity(@PathVariable Long universityId) {
        List<Supervisor> supervisors = supervisorService.getSupervisorsByUniversity(universityId);
        return ResponseEntity.ok(supervisors);
    }
    
    @PostMapping
    public ResponseEntity<Supervisor> createSupervisor(@RequestBody Supervisor supervisor) {
        try {
            Supervisor createdSupervisor = supervisorService.createSupervisor(supervisor);
            return ResponseEntity.ok(createdSupervisor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Supervisor> updateSupervisor(@PathVariable Long id, @RequestBody Supervisor supervisorDetails) {
        try {
            Supervisor supervisor = supervisorService.updateSupervisor(id, supervisorDetails);
            return ResponseEntity.ok(supervisor);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupervisor(@PathVariable Long id) {
        supervisorService.deleteSupervisor(id);
        return ResponseEntity.ok().build();
    }
}