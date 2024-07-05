package com.example.votingsystem.controller;

import com.example.votingsystem.dto.CandidateRequest;
import com.example.votingsystem.service.CandidateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/candidate/")
@RequiredArgsConstructor

/*
    CandidateController is used to handle the candidate related requests
    It is used to add a candidate, get all candidates, get candidate by id and get candidate votes
 */
public class CandidateController {

    private final CandidateService candidateService;


    /*
        addCandidate is used to add a candidate to the database
        it takes a candidateRequest object as a parameter
        and returns a response entity
     */
    @PostMapping("/add")
    ResponseEntity<?> addCandidate(
            @RequestBody CandidateRequest candidateRequest
    ) {
        return candidateService.addCandidate(candidateRequest);
    }

    /*
        getAllCandidates is used to get all the candidates in the database
        it returns a response entity
     */
    @GetMapping("/all")
    ResponseEntity<?> getAllCandidates() {
        return candidateService.getAllCandidates();
    }

    /*
        getCandidateById is used to get a candidate by id
        it takes the candidate id as a parameter
        and returns a response entity
     */
    @GetMapping("/{id}")
    ResponseEntity<?> getCandidateById(
            @PathVariable String id
    ) {
        return candidateService.getCandidateById(id);
    }

    /*
        getCandidateVotes is used to get the votes of a candidate
        it takes the candidate id and the election id as parameters
        and returns a response entity
     */
    @GetMapping("/{id}/votes")
    ResponseEntity<?> getCandidateVotes(
            @PathVariable String id ,
            @RequestParam(value = "electionId", required = true) String electionId
    ) {
        return candidateService.getCandidateVotes(id, electionId);
    }
}
