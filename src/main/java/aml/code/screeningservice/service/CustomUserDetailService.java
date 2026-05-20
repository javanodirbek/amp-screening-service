package aml.code.screeningservice.service;

import aml.code.screeningservice.config.CustomUserDetails;
import aml.code.screeningservice.entity.users.User;
import aml.code.screeningservice.exception.UserNotFoundException;
import aml.code.screeningservice.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;

@Service
public class CustomUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public CustomUserDetails loadUserByUsername(String username) throws UserNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null)
            throw new UserNotFoundException("user.not.found");

        Set<GrantedAuthority> authorities = new HashSet<>();
        if (Objects.nonNull(user.getRole()))
            authorities.add(authority.apply(user.getRole().getAuthority()));

        return new CustomUserDetails(user, authorities);
    }

    private final static Function<String, SimpleGrantedAuthority> authority = SimpleGrantedAuthority::new;
}
