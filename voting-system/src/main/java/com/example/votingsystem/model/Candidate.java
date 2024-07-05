package com.example.votingsystem.model;

import com.example.votingsystem.dto.CandidateDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "candidates")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder

/*
    Candidate class is used to represent the candidate entity in the database
    u can check the readme file #dbmodel to see the database model

 */

public class Candidate {
    @Id
    @Column(name = "candidateid", nullable = false)
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID candidateId;

    @ManyToOne
    @JoinColumn(name = "userid" , nullable = false)
    private User userId;

    @ManyToOne
    @JoinColumn(name = "electionid", nullable = false)
    private Election election;

    public CandidateDTO toDTO() {
        return CandidateDTO.builder()
                .candidateFirstName(userId.getFirstname())
                .candidateLastName(userId.getLastname())
                .candidateId(candidateId)
                .userId(userId.getId())
                .electionId(election.getElectionId())
                .build();
    }
}
