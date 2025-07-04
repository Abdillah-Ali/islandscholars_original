package com.islandscholars.controller;

import com.islandscholars.entity.Internship;
import com.islandscholars.entity.Student;
import com.islandscholars.service.InternshipSuggestionService;
import com.islandscholars.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/suggestions")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class InternshipSuggestionController {
    
    @Autowired
    private InternshipSuggestionService suggestionService;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @GetMapping("/internships/student/{studentId}")
    public ResponseEntity<List<Internship>> getSuggestedInternships(@PathVariable Long studentId) {
        Student student = studentRepository.findByUserId(studentId).orElse(null);
        if (student == null) {
            return ResponseEntity.notFound().build();
        }
        
        List<Internship> suggestions = suggestionService.getSuggestedInternships(student);
        return ResponseEntity.ok(suggestions);
    }
}