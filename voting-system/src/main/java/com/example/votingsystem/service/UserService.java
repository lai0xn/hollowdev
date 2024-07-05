package com.example.votingsystem.service;

import com.example.votingsystem.dto.RegisterRequest;
import com.example.votingsystem.dto.UserDTO;
import com.example.votingsystem.jwt.JwtService;
import com.example.votingsystem.model.User;
import com.example.votingsystem.model.USERTYPE;
import com.example.votingsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
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

    /*
        register is used to register a user
        it takes a registerRequest object as a parameter
        and returns a response entity
     */

    public ResponseEntity<?> register(RegisterRequest registerRequest) {
        try {
            log.info("Registering user with request: {}", registerRequest);

            log.info("Checking if username and email already exists");
            if (userRepository.existsByUsername(registerRequest.getUsername())) {
                log.warn("Username is already taken!");
                return ResponseEntity.badRequest().body("Error: Username is already taken!");
            }
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                log.warn("Email is already taken!");
                return ResponseEntity.badRequest().body("Error: Email is already taken!");
            }

            log.info("Creating user");
            if(registerRequest.getUserType() == null) {
                log.info("User type is null, setting to NORMAL");
            }
            User user = User.builder()
                    .firstname(registerRequest.getFirstname())
                    .lastname(registerRequest.getLastname())
                    .username(registerRequest.getUsername())
                    .email(registerRequest.getEmail())
                    .password(passwordEncoder.encode(registerRequest.getPassword()))
                    .usertype(registerRequest.getUserType() != null ? registerRequest.getUserType() : USERTYPE.NORMAL) // Use directly
                    .build();

            log.info("Saving user to database");
            userRepository.save(user);
            // TODO: Generate token
            log.info("Generating token");
            String token = jwtService.generateToken(user);

            return ResponseEntity.ok().body(
                    new HashMap<>(1) {{
                        put("message", "User registered successfully!");
                        put("token", token);
                    }});
        } catch (Exception e) {
            log.error("Failed to register user", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
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
            if(user == null) {
                log.warn("User not found for id: {}", userId);
                return ResponseEntity.badRequest().body("User not found");
            }
            // TODO: Convert User to UserDTO
            log.info("Converting user to UserDTO");
            UserDTO userDTO = UserDTO.fromUser(user);

            return ResponseEntity.ok().body(userDTO);
        } catch (Exception e) {
            log.error("Failed to fetch user", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
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
            log.error("Failed to fetch users", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
