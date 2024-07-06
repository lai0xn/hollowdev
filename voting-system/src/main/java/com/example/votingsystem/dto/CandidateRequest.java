package com.example.votingsystem.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@NoArgsConstructor
@Data
public class CandidateRequest {
    private UUID userId;
    private UUID electionId;
}
