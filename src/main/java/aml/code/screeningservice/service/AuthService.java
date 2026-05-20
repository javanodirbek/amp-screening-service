package aml.code.screeningservice.service;

import aml.code.screeningservice.config.CustomAuthenticationProvider;
import aml.code.screeningservice.config.CustomUserDetails;
import aml.code.screeningservice.dto.response.TokenResponse;
import aml.code.screeningservice.entity.enums.SessionUserStatus;
import aml.code.screeningservice.entity.enums.UserRole;
import aml.code.screeningservice.entity.users.SessionUser;
import aml.code.screeningservice.entity.users.User;
import aml.code.screeningservice.exception.DuplicateResourceException;
import aml.code.screeningservice.exception.UserNotFoundException;
import aml.code.screeningservice.repository.SessionUserRepository;
import aml.code.screeningservice.repository.UserRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final CustomAuthenticationProvider authenticationProvider;
    private final UserRepository userRepository;
    private final SessionUserRepository sessionUserRepository;
    private final JwtTokenService jwtTokenService;
    private final PasswordEncoder passwordEncoder;

    public TokenResponse login(String name, String password) {
        log.info("Login attempt for username: {}", name);
        Authentication authenticate = authenticationProvider.authenticate(new UsernamePasswordAuthenticationToken(name, password));
        CustomUserDetails userDetails = (CustomUserDetails) authenticate.getPrincipal();
        User user = userRepository.findById(userDetails.getUserId()).orElse(null);
        if (user == null) {
            log.error("User not found after authentication: {}", name);
            throw new UserNotFoundException("user.not.found");
        }
        String userRole = user.getRole().name();
        SessionUser sessionUser = sessionUserRepository.findByUserId(user.getId());
        if (sessionUser != null) {
            String accessToken = jwtTokenService.generateTokenWithRole(userDetails.getUsername(), userRole);
            String refreshToken = jwtTokenService.generateRefreshTokenWithRole(userDetails.getUsername(), userRole);
            sessionUser.setAccessToken(accessToken);
            sessionUser.setRefreshToken(refreshToken);
            sessionUser.setStatus(SessionUserStatus.ACTIVE);
            sessionUserRepository.save(sessionUser);
            log.info("User {} logged in successfully", name);  // ← Successful login

            return TokenResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .build();
        }

        String accessToken = jwtTokenService.generateTokenWithRole(userDetails.getUsername(), userRole);
        String refreshToken = jwtTokenService.generateRefreshTokenWithRole(userDetails.getUsername(), userRole);
        sessionUserRepository.save(SessionUser.builder()
                .user(user)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .status(SessionUserStatus.ACTIVE)
                .build());
        log.info("User {} logged in successfully", name);  // ← Successful login
        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public Long register(String name, String password, String email, UserRole role) {
        log.info("Registration attempt for username: {}", name);
        User user = new User();
        user.setUsername(name);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setActive(true);
        if (role == null) {
            user.setRole(UserRole.OPERATOR);
        } else {
            user.setRole(role);
        };
        userRepository.save(user);
        log.info("User {} registered successfully with role: {}", name, role);
        return user.getId();
    }
}
