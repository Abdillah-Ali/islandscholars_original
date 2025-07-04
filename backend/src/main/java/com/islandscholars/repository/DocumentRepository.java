package com.islandscholars.repository;

import com.islandscholars.entity.Document;
import com.islandscholars.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByStudent(Student student);
    List<Document> findByStudentId(Long studentId);
    List<Document> findByType(String type);
}