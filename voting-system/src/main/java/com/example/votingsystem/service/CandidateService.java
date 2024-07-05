package com.example.votingsystem.service;

import com.example.votingsystem.dto.CandidateRequest;
import com.example.votingsystem.model.Candidate;
import com.example.votingsystem.model.Election;
import com.example.votingsystem.model.User;
import com.example.votingsystem.repository.CandidateRepository;
import com.example.votingsystem.repository.ElectionRepository;
import com.example.votingsystem.repository.UserRepository;
import com.example.votingsystem.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.UUID;

@Slf4j // @Slf4j is a Lombok annotation to autocreate an Slf4j-based LoggerFactory as log
@RequiredArgsConstructor
@Service

/*
    CandidateService is used to handle the candidate related requests
    It is used to add a candidate, get all candidates, get candidate by id and get candidate votes
 */
public class CandidateService {
    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final ElectionRepository electionRepository;
    private final VoteRepository voteRepository;

    /*
        addCandidate is used to add a candidate to the database
        it takes a candidateRequest object as a parameter
        and returns a response entity
     */
    public ResponseEntity<?> addCandidate(CandidateRequest candidateRequest) {
        try {
            log.info("Adding candidate with request: {}", candidateRequest);
            User user = userRepository.findById(candidateRequest.getUserId()).orElse(null);
            if (user == null) {
                log.warn("User not found for id: {}", candidateRequest.getUserId());
                return ResponseEntity.badRequest().body("User not found");
            }
            Election election = electionRepository.findById(candidateRequest.getElectionId()).orElse(null);
            if (election == null) {
                log.warn("Election not found for id: {}", candidateRequest.getElectionId());
                return ResponseEntity.badRequest().body("Election not found");
            }

            log.info("checking if candidate already exists");
            if (candidateRepository.existsByUserIdAndElection(user, election)) {
                log.warn("Candidate already exists");
                return ResponseEntity.badRequest().body("Candidate already exists");
            }

            Candidate candidate = Candidate.builder()
                    .userId(user)
                    .election(election)
                    .build();
            candidateRepository.save(candidate);
            log.info("Candidate added successfully: {}", candidate.getCandidateId());
            return ResponseEntity.ok().body(new HashMap<>(1) {
                {
                    put("message", "Candidate added successfully");
                }
            });
        } catch (Exception e) {
            log.error("Failed to add candidate", e);
            return ResponseEntity.badRequest().body("Failed to add candidate");
        }
    }

    /*
        getAllCandidates is used to get all the candidates in the database
        it returns a response entity
     */
    public ResponseEntity<?> getAllCandidates() {
        try {
            log.info("Fetching all candidates");
            return ResponseEntity.ok().body(candidateRepository.findAll().stream().map(Candidate::toDTO));
        } catch (Exception e) {
            log.error("Failed to fetch candidates", e);
            return ResponseEntity.badRequest().body("Failed to fetch candidates");
        }
    }

    /*
        getCandidateById is used to get a candidate by id
        it takes the candidate id as a parameter
        and returns a response entity
     */
    public ResponseEntity<?> getCandidateById(String id) {
        try {
            log.info("Fetching candidate with id: {}", id);
            UUID candidateId = UUID.fromString(id);
            Candidate candidate = candidateRepository.findById(candidateId).orElse(null);
            if (candidate == null) {
                log.warn("Candidate not found for id: {}", id);
                return ResponseEntity.badRequest().body("Candidate not found");
            }
            return ResponseEntity.ok().body(candidate.toDTO());
        } catch (Exception e) {
            log.error("Failed to fetch candidate", e);
            return ResponseEntity.badRequest().body("Failed to fetch candidate");
        }
    }
    /*
        getCandidateVotes is used to get the votes of a candidate
        it takes the candidate id and the election id as parameters
        and returns a response entity
     */
    public ResponseEntity<?> getCandidateVotes(String id, String election) {
        try {
            log.info("Fetching votes for candidate id: {} in election id: {}", id, election);
            UUID candidateId = UUID.fromString(id);
            UUID electionId = UUID.fromString(election);
            int votes = voteRepository.countByCandidateId(candidateId, electionId);
            return ResponseEntity.ok().body(new HashMap<>(1) {
                {
                    put("votes", votes);
                }
            });
        } catch (Exception e) {
            log.error("Failed to fetch candidate votes", e);
            return ResponseEntity.badRequest().body("Failed to fetch candidate votes");
        }
    }
}