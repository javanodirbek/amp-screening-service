package aml.code.screeningservice.controller;

import aml.code.screeningservice.dto.request.LoginRequest;
import aml.code.screeningservice.dto.request.RegisterRequest;
import aml.code.screeningservice.dto.response.TokenResponse;
import aml.code.screeningservice.entity.enums.UserRole;
import aml.code.screeningservice.entity.users.User;
import aml.code.screeningservice.repository.UserRepository;
import aml.code.screeningservice.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.management.relation.Role;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(service.login(request.getUsername(), request.getPassword()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request.getName(), request.getPassword(), request.getEmail(), request.getRole()));
    }
}
