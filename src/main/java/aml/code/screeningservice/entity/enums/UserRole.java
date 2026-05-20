package aml.code.screeningservice.entity.enums;

import org.springframework.security.core.GrantedAuthority;

public enum UserRole implements GrantedAuthority {
    ADMIN,
    OPERATOR,
    COMPLIANCE_OFFICER;

    @Override
    public String getAuthority() {
        return "ROLE_" + this.name();
    }
}
