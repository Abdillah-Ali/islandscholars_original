package com.islandscholars.dto;

import java.util.List;

public class CreateInternshipRequest {
    private Long organizationId;
    private String title;
    private String description;
    private String location;
    private String duration;
    private String field;
    private String type;
    private Integer spotsAvailable;
    private String startDate;
    private List<String> requirements;
    private List<String> responsibilities;
    
    public CreateInternshipRequest() {}
    
    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    
    public String getField() { return field; }
    public void setField(String field) { this.field = field; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public Integer getSpotsAvailable() { return spotsAvailable; }
    public void setSpotsAvailable(Integer spotsAvailable) { this.spotsAvailable = spotsAvailable; }
    
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    
    public List<String> getRequirements() { return requirements; }
    public void setRequirements(List<String> requirements) { this.requirements = requirements; }
    
    public List<String> getResponsibilities() { return responsibilities; }
    public void setResponsibilities(List<String> responsibilities) { this.responsibilities = responsibilities; }
}