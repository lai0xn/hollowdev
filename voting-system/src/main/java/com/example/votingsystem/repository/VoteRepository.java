package com.example.votingsystem.repository;

import com.example.votingsystem.dto.VoteDTO;
import com.example.votingsystem.model.Election;
import com.example.votingsystem.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VoteRepository extends JpaRepository<Vote, UUID>{
    /*
    * countByElectionId is used to count the number of votes in an election
     */
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.candidate.candidateId = ?1")
    int countByCandidateId(UUID candidateId);

    /*
    * countByElectionId is used to count the number of votes in an election
     */
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.user.id = ?1 AND v.election.electionId = ?2")
    int countByUserIdAndElectionId(UUID userId , UUID electionId);

    /*
    * countByElectionId is used to count the number of votes in an election
     */
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.user.id = ?1 AND v.candidate.candidateId = ?2")
    int countByUserIdAndCandidateId(UUID userId ,  UUID candidateId);

    /*
    * countByElectionId is used to count the number of votes in an election
     */
    @Query("SELECT c  FROM Vote v , Candidate c WHERE v.user.id = ?1 AND v.election.electionId = ?2 AND v.candidate.candidateId = ?3")
    List<VoteDTO> findAllCandidateVotesInElection(UUID electionId);
}
