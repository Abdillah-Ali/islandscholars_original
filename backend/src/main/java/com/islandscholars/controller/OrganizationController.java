package com.islandscholars.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

import com.islandscholars.entity.Organization;
import com.islandscholars.repository.OrganizationRepository;

@RestController
@RequestMapping("/api/organizations")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class OrganizationController {

    private static final Logger log = LoggerFactory.getLogger(OrganizationController.class);
    
    @Autowired
    private OrganizationRepository organizationRepository;
    
    @GetMapping
    public ResponseEntity<List<Organization>> getAllOrganizations() {
        List<Organization> organizations = organizationRepository.findAll();
        log.info("Found {} organizations in the database.", organizations.size());
        return ResponseEntity.ok(organizations);
    }

    @GetMapping("/count")
    public long getOrganizationsCount() {
        return organizationRepository.count();
    }

    @GetMapping("/count/{name}")
    public long getOrganizationsCountByName(@PathVariable String name) {
        return organizationRepository.countByName(name);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Organization> getOrganizationById(@PathVariable Long id) {
        return organizationRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/industry/{industry}")
    public ResponseEntity<List<Organization>> getOrganizationsByIndustry(@PathVariable String industry) {
        List<Organization> organizations = organizationRepository.findByIndustry(industry);
        return ResponseEntity.ok(organizations);
    }
    
    @PostMapping
    public ResponseEntity<Organization> createOrganization(@RequestBody Organization organization) {
        Organization savedOrganization = organizationRepository.save(organization);
        return ResponseEntity.ok(savedOrganization);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Organization> updateOrganization(@PathVariable Long id, @RequestBody Organization organizationDetails) {
        return organizationRepository.findById(id)
            .map(organization -> {
                organization.setName(organizationDetails.getName());
                organization.setIndustry(organizationDetails.getIndustry());
                organization.setLocation(organizationDetails.getLocation());
                organization.setDescription(organizationDetails.getDescription());
                organization.setWebsite(organizationDetails.getWebsite());
                organization.setCompanySize(organizationDetails.getCompanySize());
                organization.setContactPerson(organizationDetails.getContactPerson());
                organization.setContactPhone(organizationDetails.getContactPhone());
                organization.setFoundedYear(organizationDetails.getFoundedYear());
                organization.setRegistrationNumber(organizationDetails.getRegistrationNumber());
                return ResponseEntity.ok(organizationRepository.save(organization));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrganization(@PathVariable Long id) {
        organizationRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
