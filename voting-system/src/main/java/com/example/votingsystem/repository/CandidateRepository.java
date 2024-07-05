package com.example.votingsystem.repository;

import com.example.votingsystem.model.Candidate;
import com.example.votingsystem.model.Election;
import com.example.votingsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, UUID> {

    boolean existsByUserIdAndElection(User user, Election election);
}
