package aml.code.screeningservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;

import java.util.Locale;

@Configuration
public class LocalConfig {
    @Bean
    public LocaleResolver localeResolver() {
        SessionLocaleResolver localeResolver = new SessionLocaleResolver();
        localeResolver.setDefaultLocale(Locale.of("ru"));
        return localeResolver;
    }

    @Bean
    public ResourceBundleMessageSource messageSource() {
        ResourceBundleMessageSource rs = new ResourceBundleMessageSource();
        rs.setBasename("messages");
        rs.setDefaultEncoding("UTF-8");
        rs.setUseCodeAsDefaultMessage(true);
        rs.setFallbackToSystemLocale(false);
        return rs;
    }
}
