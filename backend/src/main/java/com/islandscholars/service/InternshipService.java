package com.islandscholars.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.islandscholars.dto.CreateInternshipRequest;
import com.islandscholars.dto.InternshipDTO;
import com.islandscholars.entity.Internship;
import com.islandscholars.entity.Organization;
import com.islandscholars.repository.InternshipRepository;
import com.islandscholars.repository.OrganizationRepository;
import java.util.stream.Collectors;

@Service
public class InternshipService {

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    public List<InternshipDTO> getAllInternships() {
        List<Internship> internships = internshipRepository.findAll();
        System.out.println("Fetched internships: " + internships.size());
        return internships.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private InternshipDTO convertToDTO(Internship internship) {
        return new InternshipDTO(
                internship.getId(),
                internship.getTitle(),
                internship.getDescription(),
                internship.getLocation(),
                internship.getDuration(),
                internship.getField(),
                internship.getType(),
                internship.getSpotsAvailable(),
                internship.getStartDate(),
                internship.getStatus(),
                internship.getOrganization().getName(),
                internship.getRequirements(),
                internship.getResponsibilities()
        );
    }

    public Optional<InternshipDTO> getInternshipById(Long id) {
        return internshipRepository.findById(id).map(this::convertToDTO);
    }

    public List<InternshipDTO> getInternshipsByOrganization(Long organizationId) {
        List<Internship> internships = internshipRepository.findByOrganizationId(organizationId);
        System.out.println("Fetched internships by organization: " + internships.size());
        return internships.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<InternshipDTO> getInternshipsByField(String field) {
        List<Internship> internships = internshipRepository.findByField(field);
        System.out.println("Fetched internships by field: " + internships.size());
        return internships.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<InternshipDTO> getInternshipsByLocation(String location) {
        List<Internship> internships = internshipRepository.findByLocation(location);
        System.out.println("Fetched internships by location: " + internships.size());
        return internships.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Internship createInternship(CreateInternshipRequest request) {
        Organization organization = organizationRepository.findById(request.getOrganizationId())
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        Internship internship = new Internship();
        internship.setOrganization(organization);
        internship.setTitle(request.getTitle());
        internship.setDescription(request.getDescription());
        internship.setLocation(request.getLocation());
        internship.setDuration(request.getDuration());
        internship.setField(request.getField());
        internship.setType(request.getType());
        internship.setSpotsAvailable(request.getSpotsAvailable());
        internship.setStartDate(request.getStartDate());
        internship.setStatus("active");

        if (request.getRequirements() != null) {
            internship.setRequirements(String.join("\n", request.getRequirements()));
        }

        if (request.getResponsibilities() != null) {
            internship.setResponsibilities(String.join("\n", request.getResponsibilities()));
        }

        Internship savedInternship = internshipRepository.save(internship);
        System.out.println("Created internship with ID: " + savedInternship.getId());
        return savedInternship;
    }

    public Internship updateInternship(Long id, Internship internshipDetails) {
        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Internship not found"));

        internship.setTitle(internshipDetails.getTitle());
        internship.setDescription(internshipDetails.getDescription());
        internship.setLocation(internshipDetails.getLocation());
        internship.setDuration(internshipDetails.getDuration());
        internship.setField(internshipDetails.getField());
        internship.setType(internshipDetails.getType());
        internship.setSpotsAvailable(internshipDetails.getSpotsAvailable());
        internship.setStartDate(internshipDetails.getStartDate());
        internship.setRequirements(internshipDetails.getRequirements());
        internship.setResponsibilities(internshipDetails.getResponsibilities());
        internship.setStatus(internshipDetails.getStatus());

        Internship updatedInternship = internshipRepository.save(internship);
        System.out.println("Updated internship with ID: " + updatedInternship.getId());
        return updatedInternship;
    }

    public void deleteInternship(Long id) {
        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Internship not found"));
        internshipRepository.delete(internship);
        System.out.println("Deleted internship with ID: " + id);
    }
}
