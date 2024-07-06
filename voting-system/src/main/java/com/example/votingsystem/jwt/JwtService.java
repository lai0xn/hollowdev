package com.example.votingsystem.jwt;


import com.example.votingsystem.model.USERTYPE;
import com.example.votingsystem.model.User;
import com.example.votingsystem.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtService {

    //  Inject Environment to use later to retrieve the environment variables
    final Environment environment;
    private final UserRepository userRepository;


    // this is used to extract the user from the token to use later in authorization process
    public String extractUsername(String token) {
        return extractClaim(token,  Claims::getSubject);
    }

    // this is used to extract the claims from the token to use later in authorization process (like user role)
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // this is used to validate the token
    /*
    * 1. Extract the username from the token
    * 2. Check if the username in the token is the same as the username in the userDetails
    * 3. Check if the token is expired
    * 4. Return the result
     */
    public boolean validate(String token, UserDetails userDetails) {
        return extractUsername(token).equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    // this is used to generate the token
    /*
    * 1. Get the secret from the environment variables
    * 2. Build the token with the claims (role) and the subject (username)
    * 3. Set the issuedAt and expiration date
    * 4. Sign the token with the secret
    * 5. Return the token
     */
    public String generateToken(
            UserDetails userDetails
    ) {
        User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
        assert user != null;
        USERTYPE role = user.getUsertype();
        String secret = environment.getProperty("JWT_SECRET");
        return Jwts.builder()
                .claims(new HashMap<>(){{
                    put("role", role);
                }})
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret)))
                .compact();
    }


    // this is used to extract all the claims from the token
    public Claims extractAllClaims(String token) {
        String secret = environment.getProperty("JWT_SECRET");
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret)))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


    // this is used to check if the token is expired
    boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }
}

