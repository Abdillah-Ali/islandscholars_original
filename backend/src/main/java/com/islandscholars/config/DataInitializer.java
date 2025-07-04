package com.islandscholars.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.islandscholars.entity.User;
import com.islandscholars.entity.UserRole;
import com.islandscholars.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@islandscholars.com")) {
            User admin = new User();
            admin.setEmail("admin@islandscholars.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setRole(UserRole.ADMIN);
            userRepository.save(admin);
            
            System.out.println("Admin user created:");
            System.out.println("Email: admin@islandscholars.com");
            System.out.println("Password: admin123");
        }
    }
}