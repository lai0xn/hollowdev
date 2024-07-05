package com.example.votingsystem.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Builder
@Data
public class CandidateRequest {
    private UUID userId;
    private UUID electionId;
}
