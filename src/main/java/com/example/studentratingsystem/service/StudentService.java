package com.example.studentratingsystem.service;

import com.example.studentratingsystem.models.AddStudentForm;
import com.example.studentratingsystem.models.StudentViewModel;
import com.example.studentratingsystem.models.Student;
import com.example.studentratingsystem.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    // Получить всех студентов
    public Collection<StudentViewModel> findAllStudents() {
        return ((Collection<Student>) repository.findAll()).stream()
                .map(this::toViewModel)
                .collect(Collectors.toList());
    }

    // Найти студента по ID
    public StudentViewModel findStudentById(long id) {
        return repository.findById(id)
                .map(this::toViewModel)
                .orElseThrow(() -> new IllegalArgumentException("Студент с ID " + id + " не найден"));
    }

    // Создать нового студента
    public void create(AddStudentForm form) {
        Student student = new Student(form.firstName(), form.lastName(), form.email());
        repository.save(student);
    }

    // Обновить данные студента
    public void update(AddStudentForm form) {
        Student student = repository.findById(form.id())
                .orElseThrow(() -> new IllegalArgumentException("Студент с ID " + form.id() + " не найден"));

        student.setFirstName(form.firstName());
        student.setSecondName(form.lastName());
        student.setEmail(form.email());
        repository.save(student);
    }

    // Удалить студента
    public void delete(long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Студент с ID " + id + " не найден для удаления");
        }
        repository.deleteById(id);
    }

    // Конвертер из сущности в ViewModel
    private StudentViewModel toViewModel(Student s) {
        return new StudentViewModel(s.getId(), s.getFirstName(), s.getSecondName(), s.getEmail());
    }
}


