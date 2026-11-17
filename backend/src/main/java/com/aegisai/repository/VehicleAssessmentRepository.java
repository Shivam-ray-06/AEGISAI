package com.aegisai.repository;

import com.aegisai.entity.VehicleAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VehicleAssessmentRepository extends JpaRepository<VehicleAssessment, Long> {
    List<VehicleAssessment> findByVideoJob_VideoId(String videoId);
    List<VehicleAssessment> findByCollisionInvolvementTrue();
    List<VehicleAssessment> findAllByOrderByIdAsc();
}
