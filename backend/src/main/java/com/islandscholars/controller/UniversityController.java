package com.islandscholars.controller;

import com.islandscholars.entity.University;
import com.islandscholars.repository.UniversityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/universities")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UniversityController {
    
    @Autowired
    private UniversityRepository universityRepository;
    
    @GetMapping
    public ResponseEntity<List<University>> getAllUniversities() {
        List<University> universities = universityRepository.findAll();
        return ResponseEntity.ok(universities);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<University> getUniversityById(@PathVariable Long id) {
        return universityRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<University> createUniversity(@RequestBody University university) {
        University savedUniversity = universityRepository.save(university);
        return ResponseEntity.ok(savedUniversity);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<University> updateUniversity(@PathVariable Long id, @RequestBody University universityDetails) {
        return universityRepository.findById(id)
            .map(university -> {
                university.setName(universityDetails.getName());
                university.setLocation(universityDetails.getLocation());
                university.setDescription(universityDetails.getDescription());
                university.setWebsite(universityDetails.getWebsite());
                university.setPhoneNumber(universityDetails.getPhoneNumber());
                university.setEstablishedYear(universityDetails.getEstablishedYear());
                university.setStudentCount(universityDetails.getStudentCount());
                university.setFacultyCount(universityDetails.getFacultyCount());
                return ResponseEntity.ok(universityRepository.save(university));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUniversity(@PathVariable Long id) {
        universityRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}