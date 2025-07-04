package com.islandscholars.service;

import com.islandscholars.entity.Notification;
import com.islandscholars.entity.User;
import com.islandscholars.entity.Student;
import com.islandscholars.entity.Application;
import com.islandscholars.entity.Supervisor;
import com.islandscholars.repository.NotificationRepository;
import com.islandscholars.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public void sendApplicationStatusNotification(Student student, String status, String organizationName) {
        User user = student.getUser();
        
        String title = status.equals("accepted") ? "Application Accepted!" : "Application Update";
        String message = status.equals("accepted") 
            ? String.format("Congratulations! Your application to %s has been accepted.", organizationName)
            : String.format("Your application to %s has been %s.", organizationName, status);
        
        createNotification(user, title, message, "application_status");
    }
    
    public void sendSupervisorAssignmentNotification(Student student, Supervisor supervisor) {
        User user = student.getUser();
        
        String title = "Supervisor Assigned";
        String message = String.format("You have been assigned a supervisor: %s %s from %s department.", 
            supervisor.getUser().getFirstName(), 
            supervisor.getUser().getLastName(),
            supervisor.getDepartment());
        
        createNotification(user, title, message, "supervisor_assignment");
    }
    
    public void sendDocumentReminderNotification(Student student, List<String> missingDocuments) {
        User user = student.getUser();
        
        String title = "Documents Required";
        String message = String.format("Please upload the following required documents: %s", 
            String.join(", ", missingDocuments));
        
        createNotification(user, title, message, "document_reminder");
    }
    
    public void sendDeadlineReminderNotification(User user, String internshipTitle, int daysLeft) {
        String title = "Application Deadline Approaching";
        String message = String.format("The application deadline for '%s' is in %d days. Don't miss out!", 
            internshipTitle, daysLeft);
        
        createNotification(user, title, message, "deadline_reminder");
    }
    
    public void sendNewApplicationNotification(User organizationUser, String studentName, String internshipTitle) {
        String title = "New Application Received";
        String message = internshipTitle != null 
            ? String.format("New application from %s for '%s'", studentName, internshipTitle)
            : String.format("New direct application from %s", studentName);
        
        createNotification(organizationUser, title, message, "new_application");
    }
    
    public void createNotification(User user, String title, String message, String type) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setIsRead(false);
        
        notificationRepository.save(notification);
    }
    
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
    }
    
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        });
    }
    
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = getUnreadNotifications(userId);
        unreadNotifications.forEach(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        });
    }
}