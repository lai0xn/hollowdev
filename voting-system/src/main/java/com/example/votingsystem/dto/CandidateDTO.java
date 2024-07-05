package com.example.votingsystem.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class CandidateDTO {
    private String candidateFirstName;
    private String candidateLastName;
    private UUID candidateId;
    private UUID userId;
    private UUID electionId;
}
