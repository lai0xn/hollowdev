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
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor

/*
    VotingService is used to handle the voting related requests
    It is used to vote
 */

public class VotingService {
    private final VoteRepository voteRepository;
    private final UserRepository userRepository;
    private final ElectionRepository electionRepository;
    private final CandidateRepository candidateRepository;
    private final UserService userService;


    /*
        vote is used to vote
        it takes a voteRequest object as a parameter
        and returns a response entity
     */
    public ResponseEntity<?> vote(VoteRequest voteRequest) {
        try {
            log.info("Voting with request: {}", voteRequest);
            // check if user exists
            log.info("check if candidate exists");
            Candidate candidate = candidateRepository.findById(UUID.fromString(voteRequest.getCandidateId())).orElse(null);
            if (candidate == null) {
                log.warn("Candidate not found for id: {}", voteRequest.getCandidateId());
                return ResponseEntity.badRequest().body(new HashMap<>(1) {
                    {
                        put("message", "Candidate not found");
                    }
                });
            }

            log.info("get authenticated user id ");
            String userId = userService.getAuthenticatedUserId();
            log.info("Checking if user exists {} ", userId);
            User user = userRepository.findById(UUID.fromString(userId)).orElse(null);
            if (user == null) {
                log.warn("User not found for id: {}", userId);
                return ResponseEntity.badRequest().body(new HashMap<>(1) {
                    {
                        put("message", "User not found");
                    }
                });
            }
            Election election = electionRepository.findById(candidate.getElection().getElectionId()).orElse(null);

            assert election != null;
            // check if election has ended
            log.info("Checking if election has ended");
            if (election.getElectionEndDate().toInstant().isBefore(Instant.now())) {
                log.warn("Election has ended");
                return ResponseEntity.badRequest().body(new HashMap<>(1) {
                    {
                        put("message", "Election has ended");
                    }

                });
            }
            // check if the user already voted for a candidate in this election
            log.info("Checking if user has already voted for this candidate in this election");
            int countByUserIdAndElectionId = voteRepository.countByUserIdAndElectionId(UUID.fromString(userId), election.getElectionId());
            if (countByUserIdAndElectionId > 0) {
                log.warn("User has already voted for a candidate in this election");
                return ResponseEntity.badRequest().body(new HashMap<>(1) {
                    {
                        put("message", "You have already voted for a candidate in this election");
                    }

                });
            }

            // count votes of a user for a candidate in an election
            log.info("Checking if user has already voted for this candidate in this election");
            int countByUserIdAndCandidateId = voteRepository.countByUserIdAndCandidateId(UUID.fromString(userId), UUID.fromString(voteRequest.getCandidateId()));

            if (countByUserIdAndCandidateId > 0) {
                log.warn("User has already voted for this candidate in this election");
                return ResponseEntity.badRequest().body(new HashMap<>(1) {
                    {
                        put("message", "You have already voted for this candidate in this election");
                    }
                });
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
            return ResponseEntity.ok().body(new HashMap<>(1) {
                {
                    put("message", "Vote casted successfully");
                }
            });

        } catch (Exception e) {
            log.error("Failed to cast vote", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new HashMap<>(1) {
                {
                    put("message", "Failed to cast vote with error: " + e.getMessage());
                }
            });
        }


    }
}
