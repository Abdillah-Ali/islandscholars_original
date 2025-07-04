package com.islandscholars.service;

import com.islandscholars.entity.*;
import com.islandscholars.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.ArrayList;

@Service
public class AutomationService {
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private InternshipRepository internshipRepository;
    
    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private UserRepository userRepository;
    
    // Run every hour to check for deadline reminders
    @Scheduled(fixedRate = 3600000)
    public void checkDeadlineReminders() {
        List<Internship> activeInternships = internshipRepository.findByStatus("active");
        
        for (Internship internship : activeInternships) {
            if (internship.getStartDate() != null) {
                try {
                    LocalDateTime startDate = LocalDateTime.parse(internship.getStartDate() + "T00:00:00");
                    LocalDateTime now = LocalDateTime.now();
                    long daysUntilStart = ChronoUnit.DAYS.between(now, startDate);
                    
                    if (daysUntilStart == 7 || daysUntilStart == 3 || daysUntilStart == 1) {
                        // Send reminders to students who haven't applied yet
                        List<Student> allStudents = studentRepository.findAll();
                        for (Student student : allStudents) {
                            boolean hasApplied = applicationRepository.findByStudentAndInternship(student, internship).isPresent();
                            if (!hasApplied) {
                                notificationService.sendDeadlineReminderNotification(
                                    student.getUser(), 
                                    internship.getTitle(), 
                                    (int) daysUntilStart
                                );
                            }
                        }
                    }
                } catch (Exception e) {
                    // Handle date parsing errors
                    System.err.println("Error parsing start date for internship: " + internship.getId());
                }
            }
        }
    }
    
    // Run daily to check for document reminders
    @Scheduled(fixedRate = 86400000)
    public void checkDocumentReminders() {
        List<Student> students = studentRepository.findAll();
        
        for (Student student : students) {
            List<String> missingDocuments = getMissingDocuments(student);
            
            if (!missingDocuments.isEmpty()) {
                // Only send reminder if student has accepted applications
                boolean hasAcceptedApplications = applicationRepository.findByStudentId(student.getId())
                    .stream()
                    .anyMatch(app -> "accepted".equalsIgnoreCase(app.getStatus()));
                
                if (hasAcceptedApplications) {
                    notificationService.sendDocumentReminderNotification(student, missingDocuments);
                }
            }
        }
    }
    
    private List<String> getMissingDocuments(Student student) {
        List<String> missingDocs = new ArrayList<>();
        List<Document> documents = documentRepository.findByStudentId(student.getId());
        
        boolean hasCv = documents.stream().anyMatch(doc -> "cv".equalsIgnoreCase(doc.getType()));
        boolean hasIntroLetter = documents.stream().anyMatch(doc -> "introduction_letter".equalsIgnoreCase(doc.getType()));
        
        if (!hasCv) {
            missingDocs.add("CV/Resume");
        }
        if (!hasIntroLetter) {
            missingDocs.add("University Introduction Letter");
        }
        
        return missingDocs;
    }
    
    // Run daily to clean up expired internships
    @Scheduled(fixedRate = 86400000)
    public void cleanupExpiredInternships() {
        List<Internship> activeInternships = internshipRepository.findByStatus("active");
        LocalDateTime now = LocalDateTime.now();
        
        for (Internship internship : activeInternships) {
            if (internship.getStartDate() != null) {
                try {
                    LocalDateTime startDate = LocalDateTime.parse(internship.getStartDate() + "T00:00:00");
                    
                    // Mark as expired if start date has passed
                    if (startDate.isBefore(now)) {
                        internship.setStatus("expired");
                        internshipRepository.save(internship);
                    }
                } catch (Exception e) {
                    System.err.println("Error parsing start date for internship: " + internship.getId());
                }
            }
        }
    }
    
    public void processApplicationStatusUpdate(Application application, String newStatus) {
        if ("accepted".equalsIgnoreCase(newStatus)) {
            // Send notification to student
            notificationService.sendApplicationStatusNotification(
                application.getStudent(), 
                newStatus, 
                application.getInternship() != null 
                    ? application.getInternship().getOrganization().getName()
                    : application.getOrganization().getName()
            );
        }
    }
    
    public void processSupervisorAssignment(Student student, Supervisor supervisor) {
        // Send notification to student
        notificationService.sendSupervisorAssignmentNotification(student, supervisor);
    }
    
    public void processNewApplication(Application application) {
        // Send notification to organization
        User organizationUser = null;
        String studentName = application.getStudent().getUser().getFirstName() + " " + 
                           application.getStudent().getUser().getLastName();
        String internshipTitle = null;
        
        if (application.getInternship() != null) {
            // Find organization user for internship application
            String orgEmail = application.getInternship().getOrganization().getEmail();
            organizationUser = userRepository.findByEmail(orgEmail).orElse(null);
            internshipTitle = application.getInternship().getTitle();
        } else if (application.getOrganization() != null) {
            // Find organization user for direct application
            String orgEmail = application.getOrganization().getEmail();
            organizationUser = userRepository.findByEmail(orgEmail).orElse(null);
        }
        
        if (organizationUser != null) {
            notificationService.sendNewApplicationNotification(organizationUser, studentName, internshipTitle);
        }
    }
}