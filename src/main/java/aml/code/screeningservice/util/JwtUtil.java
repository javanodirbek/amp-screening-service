package aml.code.screeningservice.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jwts;
import org.springframework.util.StringUtils;

import java.security.Key;
import java.time.Clock;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;

@Component
public class JwtUtil {
    public String getSubject(String token, String secret) {
        Claims claims = extractAllClaims(token, secret);
        return claims.getSubject();
    }

    public String jwt(Map<String, Object> extraClaims, String subject, String secret) {
        Instant now = Instant.now(Clock.systemDefaultZone());
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(subject)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(24, ChronoUnit.HOURS)))
                .signWith(io.jsonwebtoken.SignatureAlgorithm.HS256, secret)
                .signWith(getSignInKey(secret), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, String secret) {
        if (!StringUtils.hasText(token))
            return false;

        if (expireToken(token, secret))
            return false;

        return Objects.nonNull(getSubject(token, secret));
    }

    private Key getSignInKey(String secret) {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Date getExpiration(String token, String secret) {
        Date date = getClaims(token, Claims::getExpiration, secret);
        if (date != null)
            return date;
        return null;
    }

    public boolean expireToken(String token, String secret) {
        Date expiration = getExpiration(token, secret);
        if (expiration == null)
            return true;
        return expiration.before(Date.from(Instant.now(Clock.systemDefaultZone())));
    }

    public <T> T getClaims(String token, Function<Claims, T> clamsResolver, String secret) {
        final Claims claims = extractAllClaims(token, secret);
        return clamsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token, String secret) {
        return Jwts
                .parser()
                .setSigningKey(getSignInKey(secret))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String refreshJwt(Map<String, Object> extraClaims, String subject, String tokenSecret) {
        Instant now = Instant.now(Clock.systemDefaultZone());
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(subject)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(10, ChronoUnit.HOURS)))
                .signWith(getSignInKey(tokenSecret), SignatureAlgorithm.HS256)
                .compact();
    }
}
