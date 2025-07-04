package com.islandscholars.service;

import com.islandscholars.entity.Student;
import com.islandscholars.entity.Supervisor;
import com.islandscholars.repository.StudentRepository;
import com.islandscholars.repository.SupervisorRepository;
import com.islandscholars.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private SupervisorRepository supervisorRepository;
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private AutomationService automationService;
    
    public List<Student> getAcceptedStudentsByUniversity(Long universityId) {
        List<Student> allStudents = studentRepository.findByUniversityId(universityId);
        
        return allStudents.stream()
            .filter(student -> applicationRepository.findByStudentId(student.getId())
                .stream()
                .anyMatch(app -> "accepted".equalsIgnoreCase(app.getStatus())))
            .collect(Collectors.toList());
    }
    
    public Student assignSupervisor(Long studentId, Long supervisorId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        
        Supervisor supervisor = supervisorRepository.findById(supervisorId)
            .orElseThrow(() -> new RuntimeException("Supervisor not found"));
        
        student.setSupervisor(supervisor);
        Student savedStudent = studentRepository.save(student);
        
        // Trigger automation for supervisor assignment
        automationService.processSupervisorAssignment(savedStudent, supervisor);
        
        return savedStudent;
    }
}