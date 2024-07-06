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
import org.springframework.http.HttpStatus;
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
                return ResponseEntity.badRequest().body(new HashMap<>(1){
                    {
                        put("message", "User not found");
                    }

                });
            }
            log.info("check if the user is admin");
            if (user.getUsertype().name().equals("ADMIN")) {
                log.warn("Admin cannot be a candidate");
                return ResponseEntity.badRequest().body(new HashMap<>(1){
                    {
                        put("message", "Admin cannot be a candidate");
                    }

                });
            }
            log.info("check if election exists");
            Election election = electionRepository.findById(candidateRequest.getElectionId()).orElse(null);
            if (election == null) {
                log.warn("Election not found for id: {}", candidateRequest.getElectionId());
                return ResponseEntity.badRequest().body(new HashMap<>(1){
                    {
                        put("message", "Election not found");
                    }
                });
            }

            log.info("checking if candidate already exists");
            if (candidateRepository.existsByUserIdAndElection(user, election)) {
                log.warn("Candidate already exists");
                return ResponseEntity.badRequest().body(new HashMap<>(1){
                    {
                        put("message", "Candidate already exists");
                    }
                });
            }

            Candidate candidate = Candidate.builder()
                    .userId(user)
                    .election(election)
                    .build();
            candidateRepository.save(candidate);
            log.info("Candidate added successfully: {}", candidate.getCandidateId());
            return ResponseEntity.status(HttpStatus.CREATED).body(new HashMap<>(1) {
                {
                    put("message", "Candidate added successfully");
                }
            });
        } catch (Exception e) {
            log.error("Failed to add candidate", e);
            return ResponseEntity.badRequest().body(new HashMap<>(1){
                {
                    put("message", "Failed to add candidate");
                }

            });
        }
    }



    /*
        getCandidateVotes is used to get the votes of a candidate
        it takes the candidate id and the election id as parameters
        and returns a response entity
     */
    public ResponseEntity<?> getCandidateVotes(String id) {
        try {
            log.info("Fetching votes for candidate id: {}", id);
            UUID candidateId = UUID.fromString(id);
            int votes = voteRepository.countByCandidateId(candidateId);
            return ResponseEntity.ok().body(new HashMap<>(1) {
                {
                    put("votes", votes);
                }
            });
        } catch (Exception e) {
            log.error("Failed to fetch candidate votes", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new HashMap<>(1){
                {
                    put("message", "Failed to fetch candidate votes");
                }
            });
        }
    }

    public ResponseEntity<?> deleteCandidate(String id) {
        try {
            log.info("Deleting candidate with id: {}", id);
            UUID candidateId = UUID.fromString(id);
            log.info("checking if candidate exists {}", candidateId);
            if (!candidateRepository.existsById(candidateId)) {
                log.warn("Candidate not found for id: {}", id);
                return ResponseEntity.badRequest().body(new HashMap<>(1) {
                    {
                        put("message", "Candidate not found");
                    }
                });
            }
            candidateRepository.deleteById(candidateId);
            return ResponseEntity.ok().body(new HashMap<>(1) {
                {
                    put("message", "Candidate deleted successfully");
                }
            });
        } catch (Exception e) {
            log.error("Failed to delete candidate", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new HashMap<>(1){
                {
                    put("message", "Failed to delete candidate");
                }
            });
        }
    }
}