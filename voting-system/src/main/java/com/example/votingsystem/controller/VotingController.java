package com.example.votingsystem.controller;

import com.example.votingsystem.dto.VoteRequest;
import com.example.votingsystem.service.VotingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/votes/")
@RequiredArgsConstructor
/*
    VotingController is used to handle the voting related requests
    It is used to vote
 */
public class VotingController {

    final VotingService votingService;

    /*
        vote is used to vote
        it takes a voteRequest object as a parameter
        and returns a response entity
     */

    @PostMapping("/add")
    ResponseEntity<?> vote(
            @RequestBody VoteRequest voteRequest
    ) {
        return votingService.vote(voteRequest);
    }

}
