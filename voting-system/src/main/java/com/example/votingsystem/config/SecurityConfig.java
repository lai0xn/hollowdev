package com.example.votingsystem.config;

import com.example.votingsystem.jwt.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor

/*
    SecurityConfig is used to configure the security of the application
    It is used to configure the security filter chain
 */
public class SecurityConfig {
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain (
            HttpSecurity http ,
            JwtAuthFilter jwtAuthenticationFilter
    ) throws Exception{
        http
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF
                .cors(AbstractHttpConfigurer::disable) // Disable CORS
                .authorizeHttpRequests(
                        req -> req.requestMatchers("/api/v1/user/").permitAll() // Permit all requests to /api/v1/user/
                                .requestMatchers("/api/v1/candidate/add").hasAuthority("ADMIN") // Permit requests to /api/v1/candidate/add only if the user has the ADMIN authority
                                .requestMatchers("/api/v1/election/add").hasAuthority("ADMIN") // Permit requests to /api/v1/election/add only if the user has the ADMIN authority
                                .requestMatchers("/api/v1/votes/add").hasAuthority("USER") // Permit requests to /api/v1/votes/add only if the user has the USER authority
                                .anyRequest().authenticated() // Authenticate all other requests
                )
                .authenticationProvider(authenticationProvider) // Set the authentication provider
                .addFilterBefore(jwtAuthenticationFilter , UsernamePasswordAuthenticationFilter.class) // Add the JWT authentication filter before the UsernamePasswordAuthenticationFilter
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))// Set the session creation policy to STATELESS where STATELESS means no session will be created
        ;
        return http.build(); // Build the http object
    }
}
