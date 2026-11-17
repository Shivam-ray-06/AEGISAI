package com.aegisai.controller;

import com.aegisai.dto.ApiResponse;
import com.aegisai.entity.PedestrianAssessment;
import com.aegisai.exception.ResourceNotFoundException;
import com.aegisai.repository.PedestrianAssessmentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pedestrians")
@Tag(name = "Pedestrian & Victim Intelligence", description = "Pedestrian tracking, proximity analysis, and emergency response")
public class PedestrianController {

    private final PedestrianAssessmentRepository pedestrianAssessmentRepository;

    public PedestrianController(PedestrianAssessmentRepository pedestrianAssessmentRepository) {
        this.pedestrianAssessmentRepository = pedestrianAssessmentRepository;
    }

    @GetMapping
    @Operation(summary = "List all tracked pedestrians with movement states")
    public ResponseEntity<ApiResponse<List<PedestrianAssessment>>> getAllPedestrians(
            @RequestParam(value = "videoId", required = false) String videoId) {
        List<PedestrianAssessment> list = (videoId != null && !videoId.isBlank())
                ? pedestrianAssessmentRepository.findByVideoJob_VideoId(videoId)
                : pedestrianAssessmentRepository.findAllByOrderByIdAsc();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific pedestrian assessment and medical disclaimer profile")
    public ResponseEntity<ApiResponse<PedestrianAssessment>> getPedestrianById(@PathVariable("id") Long id) {
        PedestrianAssessment pa = pedestrianAssessmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedestrian record " + id + " not found"));
        return ResponseEntity.ok(ApiResponse.success(pa));
    }
}
