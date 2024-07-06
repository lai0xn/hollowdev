package com.example.votingsystem.repository;


import com.example.votingsystem.model.Election;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.UUID;

@Repository
public interface ElectionRepository extends JpaRepository<Election, UUID> {
    /*
    * existsByElectionNameAndElectionStartDate is used to check if an election already exists with the same name and start date
     */
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN TRUE ELSE FALSE END FROM Election e WHERE e.electionName = ?1 AND e.electionStartDate = ?2")
    boolean existsByElectionNameAndElectionStartDate(String electionName, Date electionStartDate);
}
