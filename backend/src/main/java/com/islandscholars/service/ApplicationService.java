package com.islandscholars.service;

import com.islandscholars.entity.Application;
import com.islandscholars.entity.Student;
import com.islandscholars.entity.Internship;
import com.islandscholars.entity.Organization;
import com.islandscholars.repository.ApplicationRepository;
import com.islandscholars.repository.StudentRepository;
import com.islandscholars.repository.InternshipRepository;
import com.islandscholars.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@Service
public class ApplicationService {
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private InternshipRepository internshipRepository;
    
    @Autowired
    private OrganizationRepository organizationRepository;
    
    @Autowired
    private AutomationService automationService;
    
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }
    
    public Optional<Application> getApplicationById(Long id) {
        return applicationRepository.findById(id);
    }
    
    public List<Application> getApplicationsByStudent(Long studentId) {
        return applicationRepository.findByStudentId(studentId);
    }
    
    public List<Application> getApplicationsByInternship(Long internshipId) {
        return applicationRepository.findByInternshipId(internshipId);
    }
    
    public List<Application> getApplicationsByOrganization(Long organizationId) {
        return applicationRepository.findByInternshipOrganizationId(organizationId);
    }
    
    public List<Application> getDirectApplicationsByOrganization(Long organizationId) {
        return applicationRepository.findDirectApplicationsByOrganizationId(organizationId);
    }
    
    public List<Application> getAllApplicationsByOrganization(Long organizationId) {
        return applicationRepository.findAllApplicationsByOrganizationId(organizationId);
    }
    
    public List<Application> getApplicationsByUniversity(Long universityId) {
        return applicationRepository.findByStudentUniversityId(universityId);
    }
    
    public Application createApplication(Application application) {
        Student student = studentRepository.findById(application.getStudent().getId())
            .orElseThrow(() -> new RuntimeException("Student not found"));
        
        application.setStudent(student);
        
        if (application.getInternship() != null && application.getInternship().getId() != null) {
            Internship internship = internshipRepository.findById(application.getInternship().getId())
                .orElseThrow(() -> new RuntimeException("Internship not found"));
            application.setInternship(internship);
            
            Optional<Application> existingApplication = applicationRepository
                .findByStudentAndInternship(student, internship);
            
            if (existingApplication.isPresent()) {
                throw new RuntimeException("Application already exists for this internship");
            }
        } else if (application.getOrganization() != null && application.getOrganization().getId() != null) {
            Organization organization = organizationRepository.findById(application.getOrganization().getId())
                .orElseThrow(() -> new RuntimeException("Organization not found"));
            application.setOrganization(organization);
            application.setInternship(null);
        }
        
        application.setStatus("pending");
        Application savedApplication = applicationRepository.save(application);
        
        // Trigger automation for new application
        automationService.processNewApplication(savedApplication);
        
        return savedApplication;
    }
    
    public Application createApplicationFromMap(Map<String, Object> applicationData) {
        Application application = new Application();
        
        // Extract student
        Map<String, Object> studentData = (Map<String, Object>) applicationData.get("student");
        if (studentData != null && studentData.get("id") != null) {
            Long studentId = Long.valueOf(studentData.get("id").toString());
            Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
            application.setStudent(student);
        } else {
            // Try direct studentId
            Object studentIdObj = applicationData.get("studentId");
            if (studentIdObj != null) {
                Long studentId = Long.valueOf(studentIdObj.toString());
                Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
                application.setStudent(student);
            } else {
                throw new RuntimeException("Student information is required");
            }
        }
        
        // Extract internship (optional)
        Map<String, Object> internshipData = (Map<String, Object>) applicationData.get("internship");
        if (internshipData != null && internshipData.get("id") != null) {
            Long internshipId = Long.valueOf(internshipData.get("id").toString());
            Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new RuntimeException("Internship not found"));
            application.setInternship(internship);
        } else {
            Object internshipIdObj = applicationData.get("internshipId");
            if (internshipIdObj != null) {
                Long internshipId = Long.valueOf(internshipIdObj.toString());
                Internship internship = internshipRepository.findById(internshipId)
                    .orElseThrow(() -> new RuntimeException("Internship not found"));
                application.setInternship(internship);
            }
        }
        
        // Extract organization (for direct applications)
        Map<String, Object> organizationData = (Map<String, Object>) applicationData.get("organization");
        if (organizationData != null && organizationData.get("id") != null) {
            Long organizationId = Long.valueOf(organizationData.get("id").toString());
            Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
            application.setOrganization(organization);
        } else {
            Object organizationIdObj = applicationData.get("organizationId");
            if (organizationIdObj != null) {
                Long organizationId = Long.valueOf(organizationIdObj.toString());
                Organization organization = organizationRepository.findById(organizationId)
                    .orElseThrow(() -> new RuntimeException("Organization not found"));
                application.setOrganization(organization);
            }
        }
        
        // Set application fields
        application.setCoverLetter((String) applicationData.get("coverLetter"));
        application.setWhyInterested((String) applicationData.get("whyInterested"));
        application.setRelevantExperience((String) applicationData.get("relevantExperience"));
        application.setAvailability((String) applicationData.get("availability"));
        application.setAdditionalInfo((String) applicationData.get("additionalInfo"));
        application.setStatus("pending");
        
        // Check for duplicate applications
        if (application.getInternship() != null) {
            Optional<Application> existingApplication = applicationRepository
                .findByStudentAndInternship(application.getStudent(), application.getInternship());
            
            if (existingApplication.isPresent()) {
                throw new RuntimeException("You have already applied to this internship");
            }
        }
        
        Application savedApplication = applicationRepository.save(application);
        
        // Trigger automation for new application
        automationService.processNewApplication(savedApplication);
        
        return savedApplication;
    }
    
    public Application acceptApplication(Long id) {
        Application application = applicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found"));
        
        application.setStatus("accepted");
        application.setReviewedAt(LocalDateTime.now());
        
        Application savedApplication = applicationRepository.save(application);
        
        // Trigger automation for status update
        automationService.processApplicationStatusUpdate(savedApplication, "accepted");
        
        return savedApplication;
    }
    
    public Application rejectApplication(Long id) {
        Application application = applicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found"));
        
        application.setStatus("rejected");
        application.setReviewedAt(LocalDateTime.now());
        
        Application savedApplication = applicationRepository.save(application);
        
        // Trigger automation for status update
        automationService.processApplicationStatusUpdate(savedApplication, "rejected");
        
        return savedApplication;
    }
    
    public void deleteApplication(Long id) {
        applicationRepository.deleteById(id);
    }
}