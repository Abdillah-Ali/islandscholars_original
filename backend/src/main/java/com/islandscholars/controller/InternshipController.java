package com.islandscholars.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.islandscholars.dto.CreateInternshipRequest;
import com.islandscholars.dto.InternshipDTO;
import com.islandscholars.entity.Internship;
import com.islandscholars.service.InternshipService;

@RestController
@RequestMapping("/api/internships")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class InternshipController {

    @Autowired
    private InternshipService internshipService;

    @GetMapping
    public ResponseEntity<List<InternshipDTO>> getAllInternships() {
        System.out.println("GET /api/internships called.");
        List<InternshipDTO> internships = internshipService.getAllInternships();
        return ResponseEntity.ok(internships);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InternshipDTO> getInternshipById(@PathVariable Long id) {
        System.out.println("GET /api/internships/" + id + " called.");
        return internshipService.getInternshipById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/organization/{organizationId}")
    public ResponseEntity<List<InternshipDTO>> getInternshipsByOrganization(@PathVariable Long organizationId) {
        System.out.println("GET /api/internships/organization/" + organizationId + " called.");
        List<InternshipDTO> internships = internshipService.getInternshipsByOrganization(organizationId);
        return ResponseEntity.ok(internships);
    }

    @GetMapping("/field/{field}")
    public ResponseEntity<List<InternshipDTO>> getInternshipsByField(@PathVariable String field) {
        System.out.println("GET /api/internships/field/" + field + " called.");
        List<InternshipDTO> internships = internshipService.getInternshipsByField(field);
        return ResponseEntity.ok(internships);
    }

    @GetMapping("/location/{location}")
    public ResponseEntity<List<InternshipDTO>> getInternshipsByLocation(@PathVariable String location) {
        System.out.println("GET /api/internships/location/" + location + " called.");
        List<InternshipDTO> internships = internshipService.getInternshipsByLocation(location);
        return ResponseEntity.ok(internships);
    }

    @PostMapping
    public ResponseEntity<Internship> createInternship(@RequestBody CreateInternshipRequest request) {
        System.out.println("POST /api/internships called.");
        try {
            Internship internship = internshipService.createInternship(request);
            return ResponseEntity.ok(internship);
        } catch (Exception e) {
            System.out.println("Error creating internship: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Internship> updateInternship(@PathVariable Long id, @RequestBody Internship internshipDetails) {
        System.out.println("PUT /api/internships/" + id + " called.");
        try {
            Internship internship = internshipService.updateInternship(id, internshipDetails);
            return ResponseEntity.ok(internship);
        } catch (Exception e) {
            System.out.println("Error updating internship: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInternship(@PathVariable Long id) {
        System.out.println("DELETE /api/internships/" + id + " called.");
        try {
            internshipService.deleteInternship(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("Error deleting internship: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
