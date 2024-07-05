package com.example.votingsystem.dto;


import com.example.votingsystem.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Builder
@Data
public class UserDTO {
    private UUID userId;
    private String firstname;
    private String lastname;
    private String username;
    private String email;
    private String userType;

    public static UserDTO fromUser(User user) {
        return UserDTO.builder()
                .userId(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .username(user.getUsername())
                .email(user.getEmail())
                .userType(user.getUsertype().name())
                .build();
    }
}
