package com.aegisai.repository;

import com.aegisai.entity.PedestrianAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PedestrianAssessmentRepository extends JpaRepository<PedestrianAssessment, Long> {
    List<PedestrianAssessment> findByVideoJob_VideoId(String videoId);
    List<PedestrianAssessment> findByWarningLevel(String warningLevel);
    List<PedestrianAssessment> findAllByOrderByIdAsc();
}
