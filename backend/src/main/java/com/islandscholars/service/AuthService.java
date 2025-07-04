package com.islandscholars.service;

import com.islandscholars.dto.LoginRequest;
import com.islandscholars.dto.RegisterRequest;
import com.islandscholars.dto.UserResponse;
import com.islandscholars.entity.*;
import com.islandscholars.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UniversityRepository universityRepository;
    
    @Autowired
    private OrganizationRepository organizationRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private NotificationService notificationService;
    
    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        UserResponse response = new UserResponse(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRole().toString().toLowerCase()
        );
        
        response.setPhoneNumber(user.getPhoneNumber());
        
        if (user.getRole() == UserRole.STUDENT) {
            Student student = studentRepository.findByUserId(user.getId()).orElse(null);
            if (student != null) {
                response.setUniversityId(student.getUniversity().getId());
            }
        } else if (user.getRole() == UserRole.ORGANIZATION) {
            organizationRepository.findByEmail(user.getEmail()).ifPresent(org -> {
                response.setOrganizationId(org.getId());
            });
        } else if (user.getRole() == UserRole.UNIVERSITY) {
            universityRepository.findByEmail(user.getEmail()).ifPresent(uni -> {
                response.setUniversityId(uni.getId());
            });
        }
        
        return response;
    }
    
    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        UserRole role = UserRole.valueOf(request.getRole().toUpperCase());
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(encodedPassword);
        user.setRole(role);
        user.setPhoneNumber(request.getPhone());
        
        if (role == UserRole.STUDENT) {
            String[] nameParts = request.getName().split(" ", 2);
            user.setFirstName(nameParts[0]);
            user.setLastName(nameParts.length > 1 ? nameParts[1] : "");
        } else if (role == UserRole.ORGANIZATION) {
            user.setFirstName(request.getCompanyName());
            user.setLastName("");
        } else if (role == UserRole.UNIVERSITY) {
            user.setFirstName(request.getName());
            user.setLastName("");
        }
        
        user = userRepository.save(user);
        
        UserResponse response = new UserResponse(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRole().toString().toLowerCase()
        );
        
        response.setPhoneNumber(user.getPhoneNumber());
        
        if (role == UserRole.STUDENT) {
            Student student = createStudentProfile(user, request);
            response.setUniversityId(student.getUniversity().getId());
            
            // Send welcome notification
            notificationService.createNotification(user, "Welcome to Island Scholars!", 
                "Your student account has been created successfully. Start exploring internship opportunities!", "welcome");
        } else if (role == UserRole.ORGANIZATION) {
            Organization organization = createOrganizationProfile(user, request);
            response.setOrganizationId(organization.getId());
            
            // Send welcome notification
            notificationService.createNotification(user, "Organization Registered!", 
                "Your organization has been successfully registered. You can now post internship opportunities!", "welcome");
        } else if (role == UserRole.UNIVERSITY) {
            University university = createUniversityProfile(user, request);
            response.setUniversityId(university.getId());
            
            // Send welcome notification
            notificationService.createNotification(user, "University Registered!", 
                "Your university has been successfully registered. You can now manage students and supervisors!", "welcome");
        }
        
        return response;
    }
    
    private Student createStudentProfile(User user, RegisterRequest request) {
        University university;
        
        if ("Other".equals(request.getUniversity())) {
            throw new RuntimeException("Please select a valid university from the list");
        }
        
        university = universityRepository.findByName(request.getUniversity())
            .orElseThrow(() -> new RuntimeException("University not found: " + request.getUniversity()));
        
        Student student = new Student();
        student.setUser(user);
        student.setUniversity(university);
        student.setStudentId(request.getStudentId());
        student.setFieldOfStudy(request.getFieldOfStudy());
        student.setYearOfStudy(request.getYearOfStudy());
        
        return studentRepository.save(student);
    }
    
    private Organization createOrganizationProfile(User user, RegisterRequest request) {
        Organization organization = new Organization();
        organization.setName(request.getCompanyName());
        organization.setEmail(request.getEmail());
        organization.setIndustry(request.getIndustry());
        organization.setLocation(request.getLocation());
        organization.setDescription(request.getDescription());
        organization.setWebsite(request.getWebsite());
        organization.setCompanySize(request.getCompanySize());
        organization.setContactPerson(request.getContactPerson());
        organization.setContactPhone(request.getContactPhone());
        organization.setRegistrationNumber(request.getRegistrationNumber());
        
        if (request.getFoundedYear() != null && !request.getFoundedYear().isEmpty()) {
            try {
                organization.setFoundedYear(Integer.parseInt(request.getFoundedYear()));
            } catch (NumberFormatException e) {
                // Ignore invalid year
            }
        }
        
        return organizationRepository.save(organization);
    }
    
    private University createUniversityProfile(User user, RegisterRequest request) {
        University university = new University();
        university.setName(request.getName());
        university.setEmail(request.getEmail());
        university.setLocation(request.getLocation());
        university.setDescription(request.getDescription());
        university.setWebsite(request.getWebsite());
        university.setPhoneNumber(request.getPhone());
        
        if (request.getEstablishedYear() != null && !request.getEstablishedYear().isEmpty()) {
            try {
                university.setEstablishedYear(Integer.parseInt(request.getEstablishedYear()));
            } catch (NumberFormatException e) {
                // Ignore invalid year
            }
        }
        
        if (request.getStudentCount() != null && !request.getStudentCount().isEmpty()) {
            try {
                university.setStudentCount(Integer.parseInt(request.getStudentCount()));
            } catch (NumberFormatException e) {
                // Ignore invalid count
            }
        }
        
        if (request.getFacultyCount() != null && !request.getFacultyCount().isEmpty()) {
            try {
                university.setFacultyCount(Integer.parseInt(request.getFacultyCount()));
            } catch (NumberFormatException e) {
                // Ignore invalid count
            }
        }
        
        return universityRepository.save(university);
    }
}