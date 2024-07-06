package com.example.votingsystem.controller;


import com.example.votingsystem.dto.LoginRequest;
import com.example.votingsystem.dto.RegisterRequest;
import com.example.votingsystem.model.USERTYPE;
import com.example.votingsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/user/")
@RequiredArgsConstructor
/*
    UserController is used to handle the user related requests
    It is used to register a user, get a user by id and get all users
 */

public class UserController {
    final UserService userService;

    /*
        userRegister is used to register a user
        it takes a registerRequest object as a parameter
        and returns a response entity
     */
    @PostMapping("/register")
    public ResponseEntity<?> userRegister(@RequestBody RegisterRequest registerRequest) {
        return userService.register(registerRequest , USERTYPE.NORMAL);
    }


    /*
        adminRegister is used to register an admin
        it takes a registerRequest object as a parameter
        and returns a response entity
     */
    @PostMapping("/registerAdmin")
    public ResponseEntity<?> adminRegister(@RequestBody RegisterRequest registerRequest) {
        return userService.register(registerRequest , USERTYPE.ADMIN);
    }

    /*
        userLogin is used to login a user
        it takes a loginRequest object as a parameter
        and returns a response entity
     */

    @PostMapping("/login")
    public ResponseEntity<?> userLogin(@RequestBody LoginRequest loginRequest) {
        return userService.login(loginRequest);
    }


    /*
        getAllUsers is used to get all the users in the database
        it returns a response entity
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        return userService.getAllUsers();
    }
}
