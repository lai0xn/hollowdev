package com.example.votingsystem.service;

import com.example.votingsystem.dto.VoteRequest;
import com.example.votingsystem.model.Candidate;
import com.example.votingsystem.model.Election;
import com.example.votingsystem.model.User;
import com.example.votingsystem.model.Vote;
import com.example.votingsystem.repository.CandidateRepository;
import com.example.votingsystem.repository.ElectionRepository;
import com.example.votingsystem.repository.UserRepository;
import com.example.votingsystem.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.UUID;

@Service
@RequiredArgsConstructor

/*
    VotingService is used to handle the voting related requests
    It is used to vote
 */

public class VotingService {

    private static final Logger log = LoggerFactory.getLogger(VotingService.class);
    private final VoteRepository voteRepository;
    private final UserRepository userRepository;
    private final ElectionRepository electionRepository;
    private final CandidateRepository candidateRepository;


    /*
        vote is used to vote
        it takes a voteRequest object as a parameter
        and returns a response entity
     */
    public ResponseEntity<?> vote(VoteRequest voteRequest) {
        try {
            log.info("Voting with request: {}", voteRequest);

            // check if user exists
            log.info("Checking if user exists {} " ,voteRequest.getVoterId());
            User user =  userRepository.findById(UUID.fromString(voteRequest.getVoterId())).orElse(null);
            if(user == null) {
                log.warn("User not found for id: {}", voteRequest.getVoterId());
                return ResponseEntity.badRequest().body("User not found");
            }

            log.info("Checking if election exists {} " ,voteRequest.getElectionId());
            Election election = electionRepository.findById(UUID.fromString(voteRequest.getElectionId())).orElse(null);
            if(election == null) {
                log.warn("Election not found for id: {}", voteRequest.getElectionId());
                return ResponseEntity.badRequest().body("Election not found");
            }

            // check if election has ended
            log.info("Checking if election has ended");
            if(election.getElectionEndDate().toInstant().isBefore(Instant.now())) {
                log.warn("Election has ended");
                return ResponseEntity.badRequest().body("Election has ended");
            }

            // check if candidate exists
            log.info("Checking if candidate exists {} " ,voteRequest.getCandidateId());
            Candidate candidate = candidateRepository.findById(UUID.fromString(voteRequest.getCandidateId())).orElse(null);
            if(candidate == null) {
                log.warn("Candidate not found for id: {}", voteRequest.getCandidateId());
                return ResponseEntity.badRequest().body("Candidate not found");
            }
            // count votes of a user for a candidate in an election
            log.info("Checking if user has already voted for this candidate in this election");
            int count = voteRepository.countByUserIdAndCandidateId(UUID.fromString(voteRequest.getVoterId()), UUID.fromString(voteRequest.getElectionId()), UUID.fromString(voteRequest.getCandidateId()));

            if(count > 0) {
                log.warn("User has already voted for this candidate in this election");
                return ResponseEntity.badRequest().body("You have already voted for this candidate in this election");
            }

            // i assumed that a user can vote to multiple candidates in a single election

            log.info("Casting vote");
            Vote vote = Vote.builder()
                    .user(user)
                    .election(election)
                    .candidate(candidate)
                    .build();

            log.info("Saving vote to database");
            voteRepository.save(vote);
            return ResponseEntity.ok().body(new HashMap<>(1){
                {
                    put("message" , "Vote casted successfully");
                }
            });
        }catch (Exception e) {
            log.error("Failed to cast vote", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
