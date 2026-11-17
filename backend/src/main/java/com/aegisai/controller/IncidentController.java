package com.aegisai.controller;

import com.aegisai.dto.ApiResponse;
import com.aegisai.dto.IncidentStatusUpdateRequest;
import com.aegisai.entity.Incident;
import com.aegisai.entity.IncidentTimeline;
import com.aegisai.service.IncidentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/incidents")
@Tag(name = "Incidents", description = "Accident candidates, verification workflow, and timelines")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping
    @Operation(summary = "List all detected incident candidates")
    public ResponseEntity<ApiResponse<List<Incident>>> getAllIncidents() {
        return ResponseEntity.ok(ApiResponse.success(incidentService.getAllIncidents()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed incident candidate record")
    public ResponseEntity<ApiResponse<Incident>> getIncidentById(@PathVariable("id") String id) {
        return ResponseEntity.ok(ApiResponse.success(incidentService.getIncident(id)));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update human verification status for an incident candidate")
    public ResponseEntity<ApiResponse<Incident>> updateStatus(
            @PathVariable("id") String id,
            @Valid @RequestBody IncidentStatusUpdateRequest request) {
        Incident updated = incidentService.updateIncidentStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success(updated, "Incident status updated to " + request.getStatus()));
    }

    @GetMapping("/{id}/timeline")
    @Operation(summary = "Get chronological event timeline for an incident")
    public ResponseEntity<ApiResponse<List<IncidentTimeline>>> getIncidentTimeline(@PathVariable("id") String id) {
        return ResponseEntity.ok(ApiResponse.success(incidentService.getTimelineForIncident(id)));
    }
}
