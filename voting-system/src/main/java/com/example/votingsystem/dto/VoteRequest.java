package com.example.votingsystem.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder

public class VoteRequest {
    private String candidateId;
    private String electionId;
    private String voterId;
}
