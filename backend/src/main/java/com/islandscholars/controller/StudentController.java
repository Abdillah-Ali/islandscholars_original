package com.islandscholars.controller;

import com.islandscholars.entity.Student;
import com.islandscholars.repository.StudentRepository;
import com.islandscholars.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class StudentController {
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private StudentService studentService;
    
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        return ResponseEntity.ok(students);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return studentRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/university/{universityId}")
    public ResponseEntity<List<Student>> getStudentsByUniversity(@PathVariable Long universityId) {
        List<Student> students = studentRepository.findByUniversityId(universityId);
        return ResponseEntity.ok(students);
    }
    
    @GetMapping("/university/{universityId}/accepted")
    public ResponseEntity<List<Student>> getAcceptedStudentsByUniversity(@PathVariable Long universityId) {
        List<Student> students = studentService.getAcceptedStudentsByUniversity(universityId);
        return ResponseEntity.ok(students);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) {
        return studentRepository.findById(id)
            .map(student -> {
                student.setStudentId(studentDetails.getStudentId());
                student.setFieldOfStudy(studentDetails.getFieldOfStudy());
                student.setYearOfStudy(studentDetails.getYearOfStudy());
                student.setAddress(studentDetails.getAddress());
                student.setBio(studentDetails.getBio());
                student.setSkills(studentDetails.getSkills());
                student.setInterests(studentDetails.getInterests());
                return ResponseEntity.ok(studentRepository.save(student));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/assign-supervisor")
    public ResponseEntity<Student> assignSupervisor(@PathVariable Long id, @RequestBody Map<String, Long> request) {
        try {
            Student student = studentService.assignSupervisor(id, request.get("supervisorId"));
            return ResponseEntity.ok(student);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}