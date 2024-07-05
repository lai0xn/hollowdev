package com.example.votingsystem.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ElectionDTO {
    private String electionName;
    private String electionStartDate;
    private String electionEndDate;
    private String electionId;
}
