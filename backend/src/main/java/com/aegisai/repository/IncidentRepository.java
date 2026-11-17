package com.aegisai.repository;

import com.aegisai.entity.Incident;
import com.aegisai.enums.IncidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, String> {
    List<Incident> findByVideoJob_VideoId(String videoId);
    List<Incident> findByReviewStatus(IncidentStatus status);
    List<Incident> findAllByOrderByCreatedAtDesc();
}
