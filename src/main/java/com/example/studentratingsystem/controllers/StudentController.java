package com.example.studentratingsystem.controllers;

import com.example.studentratingsystem.models.AddStudentForm;
import com.example.studentratingsystem.models.StudentViewModel;
import com.example.studentratingsystem.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@Controller
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // 🧾 Получить список всех студентов
    @GetMapping
    @ResponseBody
    public String listAllStudents() {
        String studentListHtml = studentService.findAllStudents().stream()
                .map(this::formatStudentHtml)
                .collect(Collectors.joining("<br>"));

        return """
                <html>
                <body>
                <h2>Список студентов</h2>
                %s
                <br><br>
                <a href="/students/form">Добавить студента</a>
                </body>
                </html>
                """.formatted(studentListHtml);
    }

    // 🔍 Найти студента по ID
    @GetMapping("/{id}")
    @ResponseBody
    public String getStudentById(@PathVariable long id) {
        try {
            StudentViewModel student = studentService.findStudentById(id);
            return """
                    <html>
                    <body>
                    <h2>Информация о студенте</h2>
                    %s
                    <br><br><a href="/students">Назад</a>
                    </body>
                    </html>
                    """.formatted(formatStudentHtml(student));
        } catch (IllegalArgumentException e) {
            return """
                    <html><body><h3>Ошибка: %s</h3><a href="/students">Назад</a></body></html>
                    """.formatted(e.getMessage());
        }
    }

    // 🧍‍♂️ HTML-форма для добавления/обновления студента
    @GetMapping("/form")
    @ResponseBody
    public String showForm() {
        return """
                <html>
                <body>
                <h2>Добавить или обновить студента</h2>
                <form method="post" action="/students">
                  ID (только для обновления): <input type="number" name="id"><br><br>
                  Имя: <input type="text" name="firstName" required><br><br>
                  Фамилия: <input type="text" name="lastName" required><br><br>
                  Email: <input type="email" name="email" required><br><br>
                  <input type="submit" value="Сохранить">
                </form>
                <br>
                <a href="/students">Назад</a>
                </body>
                </html>
                """;
    }

    // ➕ Добавить студента
    @PostMapping
    @ResponseBody
    public String createOrUpdateStudent(@RequestParam(required = false) Long id,
                                        @RequestParam String firstName,
                                        @RequestParam String lastName,
                                        @RequestParam String email) {
        try {
            AddStudentForm form = new AddStudentForm(id, firstName, lastName, email);
            if (id == null) {
                studentService.create(form);
                return """
                        <html><body><h3>✅ Студент успешно добавлен!</h3>
                        <a href="/students">Назад к списку</a></body></html>
                        """;
            } else {
                studentService.update(form);
                return """
                        <html><body><h3>♻️ Данные студента обновлены!</h3>
                        <a href="/students">Назад к списку</a></body></html>
                        """;
            }
        } catch (IllegalArgumentException e) {
            return """
                    <html><body><h3>Ошибка: %s</h3><a href="/students">Назад</a></body></html>
                    """.formatted(e.getMessage());
        }
    }

    // ❌ Удалить студента
    @PostMapping("/delete/{id}")
    @ResponseBody
    public ResponseEntity<String> deleteStudent(@PathVariable long id) {
        try {
            studentService.delete(id);
            return ResponseEntity.ok("<html><body><h3>Студент удалён.</h3><a href='/students'>Назад</a></body></html>");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("<html><body><h3>Ошибка: " + e.getMessage() + "</h3></body></html>");
        }
    }

    // Вспомогательный метод для вывода студента
    private String formatStudentHtml(StudentViewModel student) {
        return String.format("ID: %d | %s %s | %s",
                student.id(),
                student.firstName(),
                student.lastName(),
                student.email());
    }
}


