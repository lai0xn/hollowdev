package com.example.votingsystem.service;

import com.example.votingsystem.dto.LoginRequest;
import com.example.votingsystem.dto.RegisterRequest;
import com.example.votingsystem.dto.UserDTO;
import com.example.votingsystem.jwt.JwtService;
import com.example.votingsystem.model.User;
import com.example.votingsystem.model.USERTYPE;
import com.example.votingsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j

/*
    UserService is used to handle the user related requests
    It is used to register a user, get a user by id and get all users
 */
public class UserService {
    private final UserRepository userRepository;
    //TODO: Add PasswordEncoder and JwtService
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /*
        register is used to register a user
        it takes a registerRequest object as a parameter
        and returns a response entity
     */

    public ResponseEntity<?> register(RegisterRequest registerRequest , USERTYPE usertype) {
        try {
            log.info("Registering user with request: {}", registerRequest.getUsername());

            log.info("Checking if username and email already exists");
            if (userRepository.existsByUsername(registerRequest.getUsername())) {
                log.warn("Username is already taken!");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new HashMap<>(1){
                    {
                        put("message", "Username is already taken!");
                    }
                });
            }
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                log.warn("Email is already taken!");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new HashMap<>(1){
                    {
                        put("message", "Email is already taken!");
                    }
                });
            }


            User user = User.builder()
                    .firstname(registerRequest.getFirstname())
                    .lastname(registerRequest.getLastname())
                    .username(registerRequest.getUsername())
                    .email(registerRequest.getEmail())
                    .password(passwordEncoder.encode(registerRequest.getPassword()))
                    .usertype(usertype) // Use directly
                    .build();

            log.info("Saving user to database");
            userRepository.save(user);
            // TODO: Generate token
            log.info("Generating token");
            String token = jwtService.generateToken(user);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    new HashMap<>(1) {{
                        put("message", "User registered successfully!");
                        put("token", token);
                        put("role" , user.getUsertype());
                    }});
        } catch (Exception e) {
            log.error("Failed to register user");
            return ResponseEntity.internalServerError().body(new HashMap<>(1){
                {
                    put("message", "Failed to register user with error: " + e.getMessage());
                }
            });
        }
    }

    /*
        getUserById is used to get a user by id
        it takes the user id as a parameter
        and returns a response entity
     */
    public ResponseEntity<?> getUserById(UUID userId) {
        try {
            log.info("Fetching user with id: {}", userId);
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                log.warn("User not found for id: {}", userId);
                return ResponseEntity.badRequest().body(new HashMap<>(1){
                    {
                        put("message", "User not found");
                    }
                });
            }
            // TODO: Convert User to UserDTO
            log.info("Converting user to UserDTO");
            UserDTO userDTO = UserDTO.fromUser(user);

            return ResponseEntity.ok().body(userDTO);
        } catch (Exception e) {
            log.error("Failed to fetch user");
            return ResponseEntity.badRequest().body(new HashMap<>(1){{
                put("message", "Failed to fetch user with error: " + e.getMessage());
            }});
        }
    }

    /*
        getAllUsers is used to get all the users in the database
        it returns a response entity
     */
    public ResponseEntity<?> getAllUsers() {
        // map all users to UserDTO
        try {
            log.info("Fetching all users");
            return ResponseEntity.ok().body(userRepository.findAll().stream().map(UserDTO::fromUser));
        } catch (Exception e) {
            log.error("Failed to fetch users");
            return ResponseEntity.badRequest().body(new HashMap<>(1){{
                put("message", "Failed to fetch users with error: " + e.getMessage());
            }});
        }
    }

    public ResponseEntity<?> login(LoginRequest loginRequest) {
        try {
            log.info("Authenticating user with request: {}", loginRequest.getUsername());
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            User user = userRepository.findByUsername(loginRequest.getUsername()).orElse(null);
            if (user == null) {
                log.warn("User not found for username: {}", loginRequest.getUsername());
                return ResponseEntity.badRequest().body("User not found");
            }
            return ResponseEntity.ok().body(new HashMap<>(1) {{
                put("message", "User authenticated successfully");
                put("token", jwtService.generateToken(user));
                put("role", user.getUsertype());
            }});
        } catch (BadCredentialsException e) {
            log.error("Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new HashMap<>(1){
                {
                    put("message", e.getMessage());
                }
            });
        } catch (AuthenticationException e) {
            log.error("Failed to authenticate user");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new HashMap<>(1){
                {
                    put("message", e.getMessage());
                }
            });
        }


    }

    public String getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return null;
        }
        return Objects.requireNonNull(userRepository.findByUsername(authentication.getName()).map(User::getId).orElse(null)).toString();
    }


}
