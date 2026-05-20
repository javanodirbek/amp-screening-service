package aml.code.screeningservice.filter;

import aml.code.screeningservice.config.CustomUserDetails;
import aml.code.screeningservice.exception.InvalidInputException;
import aml.code.screeningservice.exception.ResourceNotFoundException;
import aml.code.screeningservice.service.CustomUserDetailService;
import aml.code.screeningservice.service.JwtTokenService;
import aml.code.screeningservice.util.ApiConstants;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.LocaleResolver;

import java.io.IOException;
import java.util.Locale;
import java.util.Objects;

import static aml.code.screeningservice.config.SecurityConfig.AUTH_WHITELIST;

@Slf4j
@Component // -->> generic streotype anotation
@RequiredArgsConstructor
public class GlobalFilter extends OncePerRequestFilter {

    private final JwtTokenService jwtTokenService;
    private final CustomUserDetailService userDetailsService;
    private final LocaleResolver localeResolver;

    @Autowired
    @Qualifier("handlerExceptionResolver")
    private HandlerExceptionResolver resolver;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        long start = System.currentTimeMillis(); // hosirgi vaqtni long tipida oladi
        String requestUri = request.getRequestURI();
        log.info("getting request URI: " + requestUri);
        if (!isOpenPath(requestUri)) {
            try {
                String token = getTokenFromRequest(request);
                if (token == null ){
                    throw new InvalidInputException("Authorization token is missing");
                }
                if (!jwtTokenService.isValid(token)) {
                    throw new InvalidInputException("Invalid or expired token");
                }
                    String username = jwtTokenService.subject(token);
                    CustomUserDetails customUserDetails = userDetailsService.loadUserByUsername(username);
                    authenticate(request, customUserDetails);
                    log.info("User authenticated by id: {}", customUserDetails.getUserId());
            } catch (ResourceNotFoundException | AccessDeniedException e) {
                log.error("Global filter error", e);
                resolver.resolveException(request, response, null, e);
                return;
            }
        }
        setLang(request, response);
        filterChain.doFilter(request, response);
        long finish = System.currentTimeMillis();
        log.info("->->Request = [ {}?{} ] Elapsed time to proceed this request = {}", request.getRequestURI(),
                request.getQueryString() == null ? "" : request.getQueryString(), finish - start);
    }

    private void authenticate(HttpServletRequest request, CustomUserDetails userDetails) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(ApiConstants.HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer")) {
            return bearerToken.trim().substring(7);
        }
        return null;
    }

    private boolean isOpenPath(String currentPath) {
        for (String path : AUTH_WHITELIST) {
            if (currentPath.startsWith(path)) {
                return true;
            }
        }
        return false;
    }

    private void setLang(HttpServletRequest request, HttpServletResponse response) {
        String header = request.getHeader(ApiConstants.LANG);
        localeResolver.setLocale(request, response, new Locale(Objects.requireNonNullElse(header, ApiConstants.DEFAULT_LANG)));
    }
}
