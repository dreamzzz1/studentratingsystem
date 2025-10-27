package com.example.studentratingsystem.runner;

import com.example.studentratingsystem.models.Student;
import com.example.studentratingsystem.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final StudentRepository studentRepository;

    public DataLoader(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public void run(String... args) {
        // добавим тестового студента, если БД пуста
        if (studentRepository.count() == 0) {
            studentRepository.save(new Student("Иван", "Иванов", "ivan@example.com"));
            studentRepository.save(new Student("Анна", "Петрова", "anna@example.com"));
            System.out.println("✅ Добавлены тестовые студенты в БД");
        }

        System.out.println("📋 Список студентов:");
        studentRepository.findAll().forEach(s ->
                System.out.printf(" - %d: %s %s (%s)%n",
                        s.getId(), s.getFirstName(), s.getSecondName(), s.getEmail())
        );
    }
}
