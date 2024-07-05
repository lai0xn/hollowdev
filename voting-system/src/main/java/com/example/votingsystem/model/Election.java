package com.example.votingsystem.model;

import com.example.votingsystem.dto.ElectionDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.UUID;

/*
    Election class is used to represent the election entity in the database
    u can check the readme file #dbmodel to see the database model
 */

@Table(name = "elections" , uniqueConstraints = {
        @UniqueConstraint(columnNames = {"election_name" , "election_start_date" })
        /*
            The unique constraint is used to ensure that an election can only be in the database once
            no two elections can have the same name, start date
         */
    }
)
@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Election {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "electionid", nullable = false)
    private UUID electionId;

    private String electionName;
    private Date electionStartDate;
    private Date electionEndDate;

    @OneToMany(mappedBy = "election", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Candidate> candidates;

    @OneToMany(mappedBy = "election", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Vote> votes;

    public ElectionDTO toDTO() {
        return ElectionDTO.builder()
                .electionId(electionId.toString())
                .electionName(electionName)
                .electionStartDate(electionStartDate.toString())
                .electionEndDate(electionEndDate.toString())
                .build();
    }
}
