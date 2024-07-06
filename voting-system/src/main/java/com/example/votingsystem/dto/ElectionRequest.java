package com.example.votingsystem.dto;


import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class ElectionRequest {
    private String electionName;
    private Date electionStartDate;
    private Date electionEndDate;
}
