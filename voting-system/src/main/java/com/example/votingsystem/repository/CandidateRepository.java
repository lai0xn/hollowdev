package com.example.votingsystem.repository;

import com.example.votingsystem.model.Candidate;
import com.example.votingsystem.model.Election;
import com.example.votingsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, UUID> {
    /*
    * existsByUserIdAndElection is used to check if a candidate already exists with the same user and election
     */
    boolean existsByUserIdAndElection(User user, Election election);
}
