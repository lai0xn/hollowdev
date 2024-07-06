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
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthFilter jwtAuthenticationFilter
    ) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF
                .authorizeHttpRequests(
                        req -> req
                                // Permit all requests to the swagger-ui
                                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**", "/webjars/**").permitAll()
                                // Permit requests to /api/v1/user/register and /api/v1/user/login
                                .requestMatchers("/api/v1/user/register", "api/v1/user/login").permitAll()
                                // Permit requests to /api/v1/user/all and /api/v1/user/registerAdmin only if the user has the ADMIN authority
                                .requestMatchers("/api/v1/user/all" , "/api/v1/user/registerAdmin").hasAuthority("ADMIN")
                                // Permit requests to /api/v1/candidate/add and /api/v1/candidate/delete/ and /api/v1/candidate/{}/votes and /api/v1/election/{}/rank only if the user has the ADMIN authority
                                .requestMatchers("/api/v1/candidate/add" , "/api/v1/candidate/delete/" , "/api/v1/candidate/{}/votes"  , "/api/v1/election/{}/rank").hasAuthority("ADMIN")
                                // Permit requests to /api/v1/votes/add only if the user has the USER authority
                                .requestMatchers("/api/v1/votes/add").hasAuthority("NORMAL")
                                .anyRequest().authenticated() // Authenticate all other requests
                )
                .authenticationProvider(authenticationProvider) // Set the authentication provider
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class) // Add the JWT authentication filter before the UsernamePasswordAuthenticationFilter
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))// Set the session creation policy to STATELESS where STATELESS means no session will be created
        ;
        return http.build(); // Build the http object
    }
}
