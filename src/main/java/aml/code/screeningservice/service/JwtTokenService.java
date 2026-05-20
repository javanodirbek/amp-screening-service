package aml.code.screeningservice.service;

import aml.code.screeningservice.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JwtTokenService {

    private final JwtUtil jwtUtil;

    @Value("${jwt.token.secret}")
    private String tokenSecret;

    public Boolean isValid(String token) {
        return jwtUtil.isTokenValid(token, getTokenSecret());
    }

    public String generateToken(String subject) {
        return jwtUtil.jwt(new HashMap<>(), subject, getTokenSecret());
    }
    // YANGI METHOD - ROLE BILAN TOKEN YARATISH
    public String generateTokenWithRole(String subject, String role) {
        Map<String, Object> claims = new HashMap<>();
        // Spring Security "ROLE_" prefiksini qo'shib qidiradi
        claims.put("role", "ROLE_" + role);
        claims.put("authorities", List.of("ROLE_" + role));

        return jwtUtil.jwt(claims, subject, getTokenSecret());
    }

    // YANGI METHOD - BIR NECHTA ROLE BILAN
    public String generateTokenWithRoles(String subject, List<String> roles) {
        Map<String, Object> claims = new HashMap<>();

        // Barcha rollarga "ROLE_" prefiksini qo'shamiz
        List<String> prefixedRoles = roles.stream()
                .map(role -> "ROLE_" + role)
                .toList();

        claims.put("roles", prefixedRoles);
        claims.put("authorities", prefixedRoles);
        claims.put("role", prefixedRoles.get(0)); // Asosiy role

        return jwtUtil.jwt(claims, subject, getTokenSecret());
    }

    public String generateRefreshToken(String subject) {
        return jwtUtil.refreshJwt(new HashMap<>(), subject, getTokenSecret());
    }

    public String generateRefreshTokenWithRole(String subject, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "ROLE_" + role);
        claims.put("authorities", List.of("ROLE_" + role));

        return jwtUtil.refreshJwt(claims, subject, getTokenSecret());
    }

    public String subject(String token) {
        return jwtUtil.getSubject(token, getTokenSecret());
    }

    private String getTokenSecret() {
        return tokenSecret;
    }
}