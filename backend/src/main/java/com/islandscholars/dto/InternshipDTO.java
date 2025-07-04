package com.islandscholars.dto;

public class InternshipDTO {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String duration;
    private String field;
    private String type;
    private Integer spotsAvailable;
    private String startDate;
    private String status;
    private String organizationName;
    private String requirements;
    private String responsibilities;

    // Constructors
    public InternshipDTO() {
    }

    public InternshipDTO(Long id, String title, String description, String location, String duration, String field, String type, Integer spotsAvailable, String startDate, String status, String organizationName, String requirements, String responsibilities) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.duration = duration;
        this.field = field;
        this.type = type;
        this.spotsAvailable = spotsAvailable;
        this.startDate = startDate;
        this.status = status;
        this.organizationName = organizationName;
        this.requirements = requirements;
        this.responsibilities = responsibilities;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getSpotsAvailable() {
        return spotsAvailable;
    }

    public void setSpotsAvailable(Integer spotsAvailable) {
        this.spotsAvailable = spotsAvailable;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    public String getResponsibilities() {
        return responsibilities;
    }

    public void setResponsibilities(String responsibilities) {
        this.responsibilities = responsibilities;
    }
}
