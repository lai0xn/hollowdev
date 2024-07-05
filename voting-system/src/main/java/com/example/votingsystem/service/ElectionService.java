package com.example.votingsystem.service;

import com.example.votingsystem.dto.ElectionRequest;
import com.example.votingsystem.model.Election;
import com.example.votingsystem.repository.ElectionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.beanvalidation.SpringConstraintValidatorFactory;

import java.util.HashMap;
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

    public ResponseEntity<?> getElectionById(String id) {
        try {
            log.info("Fetching election by id: {}", id);
            return ResponseEntity.ok().body(electionRepository.findById(UUID.fromString(id)).map(Election::toDTO));
        } catch (Exception e) {
            log.error("Failed to fetch election", e);
            return ResponseEntity.badRequest().body("Failed to fetch election");
        }
    }
}
