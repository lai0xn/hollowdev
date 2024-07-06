package com.example.votingsystem.service;

import com.example.votingsystem.dto.ElectionRequest;
import com.example.votingsystem.dto.VoteDTO;
import com.example.votingsystem.model.Candidate;
import com.example.votingsystem.model.Election;
import com.example.votingsystem.repository.ElectionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.beanvalidation.SpringConstraintValidatorFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
@Slf4j
@Service
@RequiredArgsConstructor
/*
    ElectionService is used to handle the election related requests
    It is used to add an election, get all elections and get election by id
 */
public class ElectionService {
    private final ElectionRepository electionRepository;


    /*
        addElection is used to add an election to the database
        it takes an electionRequest object as a parameter
        and returns a response entity
     */
    public ResponseEntity<?> addElection(ElectionRequest electionRequest) {
        try {
            log.info("Adding election with request: {}", electionRequest);
            Election election = Election.builder()
                    .electionName(electionRequest.getElectionName())
                    .electionStartDate(electionRequest.getElectionStartDate())
                    .electionEndDate(electionRequest.getElectionEndDate())
                    .build();

            log.info("Saving election to database");
            electionRepository.save(election);
            return ResponseEntity.ok().body(new HashMap<>(
                                                    1) {{
                                                put("message", "Election added successfully");
                                            }}
            );
        } catch (Exception e) {
            log.error("Failed to add election", e);
            return ResponseEntity.badRequest().body("Failed to add election");
        }
    }
    /*
        getAllElections is used to get all the elections in the database
        it returns a response entity
     */
    public ResponseEntity<?> getAllElections() {
        try {
            // return election in electionDTO format
            log.info("Fetching all elections");
            return ResponseEntity.ok().body(electionRepository.findAll().stream().map(Election::toDTO));
        } catch (Exception e) {
            log.error("Failed to fetch elections", e);
            return ResponseEntity.badRequest().body("Failed to fetch elections");
        }
    }
    /*
        getElectionById is used to get an election by id
        it takes the election id as a parameter
        and returns a response entity
     */

    /*
        getElectionCandidates is used to get the candidates for an election
        it takes the election id as a parameter
     */
    public ResponseEntity<?> getElectionCandidates(String id) {
        try {
            log.info("Fetching election candidates by id: {}", id);
            return ResponseEntity.ok().body(electionRepository.findById(UUID.fromString(id)).map(election -> election.getCandidates().stream().map(Candidate::toDTO)));
        } catch (Exception e) {
            log.error("Failed to fetch election candidates", e);
            return ResponseEntity.badRequest().body("Failed to fetch election candidates");
        }
    }
    /*
        getElectionVoteRanking is used to get the vote ranking for an election
     */
    public ResponseEntity<?> getElectionVoteRanking(String id) {
        try {
            log.info("Fetching election vote ranking by id: {}", id);
            log.info("checking if election exists");
            if (!electionRepository.existsById(UUID.fromString(id))) {
                log.warn("Election not found");
                return ResponseEntity.badRequest().body(new HashMap<>(1) {
                    {
                        put("message", "Election not found");
                    }
                });
            }
            log.info("Fetching candidates for election id: {}", id);
            List<Candidate> candidates= electionRepository.findById(UUID.fromString(id)).map(Election::getCandidates).orElse(null);
            if(candidates == null) {
                log.warn("No candidates found for election id: {}", id);
                return ResponseEntity.badRequest().body(new HashMap<>(1) {
                    {
                        put("message", "No candidates found for election id: " + id);
                    }
                });
            }

            log.info("Converting candidates to voteDTO");
            List<VoteDTO> voteDTOS = new ArrayList<>(candidates.stream().map(candidate -> VoteDTO.builder()
                    .voteCount(candidate.getVotes().size())
                    .candidateFirstName(candidate.getUserId().getFirstname())
                    .candidateLastName(candidate.getUserId().getLastname())
                    .build()).toList());
            // sort by vote count

            log.info("Sorting candidates by vote count");
            voteDTOS.sort((a, b) -> b.getVoteCount() - a.getVoteCount());
            return ResponseEntity.ok().body(voteDTOS);
        } catch (Exception e) {
            log.error("Failed to fetch election vote ranking", e);
            return ResponseEntity.badRequest().body("Failed to fetch election vote ranking");
        }
    }
    /*
        DeleteElection is used to delete an election
        it takes the election id as a parameter
     */
    public ResponseEntity<?> deleteElection(String id) {
        try {
            log.info("Deleting election by id: {}", id);
            UUID electionId = UUID.fromString(id);
            log.info("checking if election exists");
            if (!electionRepository.existsById(electionId)) {
                log.warn("Election not found");
                return ResponseEntity.badRequest().body(new HashMap<>(1) {
                    {
                        put("message", "Election not found");
                    }

                });
            }
            electionRepository.deleteById(electionId);
            return ResponseEntity.ok().body(new HashMap<>(
                                                    1) {{
                                                put("message", "Election deleted successfully");
                                            }}
            );
        } catch (Exception e) {
            log.error("Failed to delete election", e);
            return ResponseEntity.badRequest().body("Failed to delete election");
        }
    }
}
