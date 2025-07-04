package com.islandscholars.service;

import com.islandscholars.entity.Supervisor;
import com.islandscholars.entity.User;
import com.islandscholars.entity.UserRole;
import com.islandscholars.entity.University;
import com.islandscholars.repository.SupervisorRepository;
import com.islandscholars.repository.UserRepository;
import com.islandscholars.repository.UniversityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class SupervisorService {
    
    @Autowired
    private SupervisorRepository supervisorRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UniversityRepository universityRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<Supervisor> getAllSupervisors() {
        return supervisorRepository.findAll();
    }
    
    public Optional<Supervisor> getSupervisorById(Long id) {
        return supervisorRepository.findById(id);
    }
    
    public List<Supervisor> getSupervisorsByUniversity(Long universityId) {
        return supervisorRepository.findByUniversityId(universityId);
    }
    
    @Transactional
    public Supervisor createSupervisor(Supervisor supervisor) {
        University university = universityRepository.findById(supervisor.getUniversity().getId())
            .orElseThrow(() -> new RuntimeException("University not found"));
        
        String[] nameParts = supervisor.getUser().getFirstName().split(" ", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";
        
        User user = new User();
        user.setEmail(supervisor.getUser().getEmail());
        user.setPassword(passwordEncoder.encode("supervisor123"));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(UserRole.UNIVERSITY);
        
        user = userRepository.save(user);
        
        supervisor.setUser(user);
        supervisor.setUniversity(university);
        
        return supervisorRepository.save(supervisor);
    }
    
    public Supervisor updateSupervisor(Long id, Supervisor supervisorDetails) {
        Supervisor supervisor = supervisorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Supervisor not found"));
        
        supervisor.setDepartment(supervisorDetails.getDepartment());
        supervisor.setMaxStudents(supervisorDetails.getMaxStudents());
        
        return supervisorRepository.save(supervisor);
    }
    
    public void deleteSupervisor(Long id) {
        supervisorRepository.deleteById(id);
    }
}