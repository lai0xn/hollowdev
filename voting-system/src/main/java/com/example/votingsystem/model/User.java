package com.example.votingsystem.model;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Table(name = "users")
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
/*
    User class is used to represent the user entity in the database
    It implements UserDetails to be used in the authentication process
    u can check the readme file #dbmodel to see the database model
 */
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "userid" , nullable = false)
    private UUID id;

    @Column(name = "firstname" , nullable = false , length = 50)
    private String firstname;
    @Column(name= "lastname" , nullable = false , length = 50)
    private String lastname;
    @Column(name = "username" , nullable = false , length = 50)
    private String username;
    @Column(name = "email" , nullable = false , length = 50)
    private String email;
    @Column(name = "password" , nullable = false , length = 100)
    private String password;
    @Column(name = "usertype" , nullable = false  , length = 10)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private USERTYPE usertype  = USERTYPE.NORMAL;


    @OneToMany(mappedBy = "userId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Candidate> candidates;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vote> votes;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority(usertype.name()));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

}
