package com.example.votingsystem.dto;

import com.example.votingsystem.model.USERTYPE;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RegisterRequest {
    private final String firstname;
    private final String lastname;
    private final String username;
    private final String email;
    private final String password;
    private final USERTYPE userType;
}
