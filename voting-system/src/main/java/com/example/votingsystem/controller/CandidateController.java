package com.example.votingsystem.controller;

import com.example.votingsystem.dto.CandidateRequest;
import com.example.votingsystem.service.CandidateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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
        deleteCandidate is used to delete a candidate from the database
     */

    @DeleteMapping("delete/{id}")
    ResponseEntity<?> deleteCandidate(
            @PathVariable String id
    ) {
        return candidateService.deleteCandidate(id);
    }


}
