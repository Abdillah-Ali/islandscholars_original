package com.islandscholars.service;

import com.islandscholars.entity.Student;
import com.islandscholars.entity.Internship;
import com.islandscholars.entity.Application;
import com.islandscholars.repository.InternshipRepository;
import com.islandscholars.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;

@Service
public class InternshipSuggestionService {
    
    @Autowired
    private InternshipRepository internshipRepository;
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    public List<Internship> getSuggestedInternships(Student student) {
        // Get all active internships
        List<Internship> activeInternships = internshipRepository.findByStatus("active");
        
        // Get internships student has already applied to
        List<Application> studentApplications = applicationRepository.findByStudentId(student.getId());
        Set<Long> appliedInternshipIds = studentApplications.stream()
            .filter(app -> app.getInternship() != null)
            .map(app -> app.getInternship().getId())
            .collect(Collectors.toSet());
        
        // Filter out already applied internships
        List<Internship> availableInternships = activeInternships.stream()
            .filter(internship -> !appliedInternshipIds.contains(internship.getId()))
            .collect(Collectors.toList());
        
        // Get fields student has previously applied to
        Set<String> appliedFields = studentApplications.stream()
            .filter(app -> app.getInternship() != null)
            .map(app -> app.getInternship().getField())
            .collect(Collectors.toSet());
        
        // Score and sort internships
        return availableInternships.stream()
            .sorted((i1, i2) -> {
                int score1 = calculateSuggestionScore(i1, student, appliedFields);
                int score2 = calculateSuggestionScore(i2, student, appliedFields);
                return Integer.compare(score2, score1); // Higher score first
            })
            .limit(6) // Return top 6 suggestions
            .collect(Collectors.toList());
    }
    
    private int calculateSuggestionScore(Internship internship, Student student, Set<String> appliedFields) {
        int score = 0;
        
        // Field match with student's field of study
        if (student.getFieldOfStudy() != null && 
            internship.getField().toLowerCase().contains(student.getFieldOfStudy().toLowerCase())) {
            score += 10;
        }
        
        // Field match with previously applied fields
        if (appliedFields.contains(internship.getField())) {
            score += 5;
        }
        
        // Location preference (same as university location)
        if (student.getUniversity() != null && 
            internship.getLocation().toLowerCase().contains(student.getUniversity().getLocation().toLowerCase())) {
            score += 3;
        }
        
        // Newer internships get higher score
        if (internship.getCreatedAt() != null) {
            long daysOld = java.time.temporal.ChronoUnit.DAYS.between(
                internship.getCreatedAt().toLocalDate(), 
                java.time.LocalDate.now()
            );
            if (daysOld < 7) score += 2;
            else if (daysOld < 30) score += 1;
        }
        
        // More available spots get higher score
        if (internship.getSpotsAvailable() > 1) {
            score += 1;
        }
        
        return score;
    }
}