package com.example.votingsystem.controller;

import com.example.votingsystem.dto.CandidateRequest;
import com.example.votingsystem.service.CandidateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/candidate/")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;

    @PostMapping("/add")
    ResponseEntity<?> addCandidate(
            @RequestBody CandidateRequest candidateRequest
    ) {
        return candidateService.addCandidate(candidateRequest);
    }

    @GetMapping("/all")
    ResponseEntity<?> getAllCandidates() {
        return candidateService.getAllCandidates();
    }

    @GetMapping("/{id}")
    ResponseEntity<?> getCandidateById(
            @PathVariable String id
    ) {
        return candidateService.getCandidateById(id);
    }

    @GetMapping("/{id}/votes")
    ResponseEntity<?> getCandidateVotes(
            @PathVariable String id ,
            @RequestParam(value = "electionId", required = true) String electionId
    ) {
        return candidateService.getCandidateVotes(id, electionId);
    }
}
