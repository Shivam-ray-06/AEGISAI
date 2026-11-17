package com.aegisai.controller;

import com.aegisai.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports")
@Tag(name = "Incident Reports", description = "Dossier generation, JSON feeds, and printable HTML downloads")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/{incidentId}")
    @Operation(summary = "Get full incident dossier as structured JSON")
    public ResponseEntity<Resource> getReportJson(@PathVariable("incidentId") String incidentId) {
        Resource report = reportService.getReportJson(incidentId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + incidentId + "_dossier.json\"")
                .contentType(MediaType.APPLICATION_JSON)
                .body(report);
    }

    @GetMapping("/{incidentId}/download")
    @Operation(summary = "Download printable incident report (HTML/PDF)")
    public ResponseEntity<Resource> downloadReportHtml(@PathVariable("incidentId") String incidentId) {
        Resource report = reportService.getReportHtml(incidentId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + incidentId + "_dossier.html\"")
                .contentType(MediaType.TEXT_HTML)
                .body(report);
    }
}
