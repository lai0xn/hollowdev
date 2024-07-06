package com.example.votingsystem.dto;

import com.example.votingsystem.model.USERTYPE;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RegisterRequest {
    private  String firstname;
    private  String lastname;
    private  String username;
    private  String email;
    private  String password;
}
