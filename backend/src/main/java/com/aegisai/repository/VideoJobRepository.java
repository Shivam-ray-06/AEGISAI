package com.aegisai.repository;

import com.aegisai.entity.VideoJob;
import com.aegisai.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VideoJobRepository extends JpaRepository<VideoJob, String> {
    List<VideoJob> findByStatusOrderByCreatedAtDesc(JobStatus status);
    List<VideoJob> findAllByOrderByCreatedAtDesc();
}
