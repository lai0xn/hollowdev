package com.example.votingsystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.UUID;

@Entity
@Table(name = "votes" , uniqueConstraints = {
        @UniqueConstraint(columnNames = {"userid" , "electionid" , "candidateid"})
        /*
        *   To ensure that a user can only vote once in an election, we need to add a unique constraint to the votes table
        *   This constraint will ensure that a user can only vote once in an election
        *
        * */
})

/*
    Vote class is used to represent the vote entity in the database
    u can check the readme file #dbmodel to see the database model
 */
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID voteId;

    @ManyToOne
    @JoinColumn(name = "userid", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "candidateid", nullable = false)
    private Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "electionid", nullable = false)
    private Election election;
}