package com.example.votingsystem.jwt;

import io.jsonwebtoken.Jwt;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Configuration
@RequiredArgsConstructor

/*

    Jwt auth filter is used to intercept the request and check if the token is valid
    If the token is valid, it will set the authentication in the security context
    else it will continue the filter chain implemented by spring security
    and if the user is not authenticated here he cant use the protected resources that require authentication
 */
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    final JwtService jwtService;
    final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Get the token from the header
        log.info("check if the token is received from the header");

        log.info("check if the user provided the authorization header");
        final String authorizationHeader = request.getHeader("Authorization");

        // Check if the token is null or not starting with Bearer
        log.info("check if the token is null or not starting with Bearer or not provided");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            log.warn("Token is null or not starting with Bearer or not provided");
            filterChain.doFilter(request, response);
            return;
        }
        log.info("Extract the token and the username from the token");
        final String token = authorizationHeader.substring(7);
        final String username = jwtService.extractUsername(token);

        // Check if the username is not null and the user is not authenticated
        log.info("Check if the username is not null and the user is not authenticated");
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            log.info("the user is not authenticated");
            log.info("Load the user from the userDetailsService");
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // Validate the token
            log.info("Validate the token");
            if (jwtService.validate(token, userDetails)) {
                log.info("instanciate the UsernamePasswordAuthenticationToken with the user details and the authorities");
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );

                log.info("Set the details in the authentication");
                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                log.info("Set the authentication in the security context");
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }
        log.info("Continue the filter chain");
        filterChain.doFilter(request, response);
    }
}
