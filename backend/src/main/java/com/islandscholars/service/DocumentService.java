package com.islandscholars.service;

import com.islandscholars.entity.Document;
import com.islandscholars.entity.Student;
import com.islandscholars.repository.DocumentRepository;
import com.islandscholars.repository.StudentRepository;
import com.islandscholars.config.FileUploadConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DocumentService {
    
    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private FileUploadConfig fileUploadConfig;
    
    public Document uploadDocument(MultipartFile file, Long studentId, String documentType) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        
        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(fileUploadConfig.getUploadDir(), fileName);
            Files.copy(file.getInputStream(), filePath);
            
            Document document = new Document();
            document.setStudent(student);
            document.setName(file.getOriginalFilename());
            document.setType(documentType);
            document.setFilePath(filePath.toString());
            document.setFileSize(file.getSize());
            
            return documentRepository.save(document);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }
    
    public List<Document> getDocumentsByStudent(Long studentId) {
        return documentRepository.findByStudentId(studentId);
    }
    
    public Optional<Document> getDocumentById(Long id) {
        return documentRepository.findById(id);
    }
    
    public void deleteDocument(Long id) {
        Document document = documentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Document not found"));
        
        try {
            Files.deleteIfExists(Paths.get(document.getFilePath()));
        } catch (IOException e) {
            // Log error but continue with database deletion
        }
        
        documentRepository.deleteById(id);
    }
}