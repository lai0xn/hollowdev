package com.example.votingsystem.repository;

import com.example.votingsystem.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface VoteRepository extends JpaRepository<Vote, UUID>{
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.candidate.candidateId = ?1 AND v.election.electionId = ?2")
    int countByCandidateId(UUID candidateId , UUID electionId);

    @Query("SELECT COUNT(v) FROM Vote v WHERE v.user.id = ?1 AND v.election.electionId = ?2")
    int countByUserId(UUID userId , UUID electionId);

    @Query("SELECT COUNT(v) FROM Vote v WHERE v.user.id = ?1 AND v.election.electionId = ?2 AND v.candidate.candidateId = ?3")
    int countByUserIdAndCandidateId(UUID userId , UUID electionId , UUID candidateId);
}
