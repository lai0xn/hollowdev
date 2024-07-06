package com.example.votingsystem.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class VoteDTO {
    private String candidateFirstName;
    private String candidateLastName;
    private int voteCount;
}
