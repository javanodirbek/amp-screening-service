package aml.code.screeningservice.config;

import aml.code.screeningservice.exception.InvalidCredentialException;
import aml.code.screeningservice.service.CustomUserDetailService;
import jakarta.validation.ValidationException;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {
    private final PasswordEncoder passwordEncoder;
    private final CustomUserDetailService customUserDetailService;

    public CustomAuthenticationProvider(PasswordEncoder passwordEncoder, CustomUserDetailService customUserDetailService) {
        this.passwordEncoder = passwordEncoder;
        this.customUserDetailService = customUserDetailService;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();
        CustomUserDetails userDetails = customUserDetailService.loadUserByUsername(username);
        if (!passwordEncoder.matches(password, userDetails.getPassword()))
            throw new InvalidCredentialException("invalid.user.password");
        return new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}

