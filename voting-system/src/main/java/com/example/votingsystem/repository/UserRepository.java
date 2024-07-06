package com.example.votingsystem.repository;


import com.example.votingsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID>{
    /*
    * findByUsername is used to find a user by username
     */
    Optional<User> findByUsername(String username);
    /*
    * existsByUsername is used to check if a user already exists with the same username
     */
    boolean existsByUsername(String username);
    /*
    * existsByEmail is used to check if a user already exists with the same email
     */
    boolean existsByEmail(String email);
}
