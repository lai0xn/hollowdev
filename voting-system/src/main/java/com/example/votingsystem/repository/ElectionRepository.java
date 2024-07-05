package com.example.votingsystem.repository;


import com.example.votingsystem.model.Election;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ElectionRepository extends JpaRepository<Election, UUID> {
}
