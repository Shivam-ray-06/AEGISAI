package com.aegisai.controller;

import com.aegisai.dto.ApiResponse;
import com.aegisai.entity.VehicleAssessment;
import com.aegisai.exception.ResourceNotFoundException;
import com.aegisai.repository.VehicleAssessmentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vehicles")
@Tag(name = "Vehicle Intelligence", description = "Tracked vehicles, damage classification, and impact telemetry")
public class VehicleController {

    private final VehicleAssessmentRepository vehicleAssessmentRepository;

    public VehicleController(VehicleAssessmentRepository vehicleAssessmentRepository) {
        this.vehicleAssessmentRepository = vehicleAssessmentRepository;
    }

    @GetMapping
    @Operation(summary = "List all tracked vehicles across surveillance jobs")
    public ResponseEntity<ApiResponse<List<VehicleAssessment>>> getAllVehicles(
            @RequestParam(value = "videoId", required = false) String videoId) {
        List<VehicleAssessment> list = (videoId != null && !videoId.isBlank()) 
                ? vehicleAssessmentRepository.findByVideoJob_VideoId(videoId)
                : vehicleAssessmentRepository.findAllByOrderByIdAsc();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific vehicle assessment details")
    public ResponseEntity<ApiResponse<VehicleAssessment>> getVehicleById(@PathVariable("id") Long id) {
        VehicleAssessment va = vehicleAssessmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle record " + id + " not found"));
        return ResponseEntity.ok(ApiResponse.success(va));
    }
}
