package com.example.votingsystem.dto;


import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class ElectionRequest {
    private String electionName;
    private Date electionStartDate;
    private Date electionEndDate;
}
