package com.aegisai.service;

import com.aegisai.entity.Incident;
import com.aegisai.entity.VideoJob;
import com.aegisai.exception.ResourceNotFoundException;
import com.aegisai.repository.IncidentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ReportService {

    private final IncidentRepository incidentRepository;

    @Value("${aegisai.storage.reports:/Volumes/Krishu/AEGISAI/storage/reports}")
    private String reportsDir;

    public ReportService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public Resource getReportHtml(String incidentId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident " + incidentId + " not found"));
        
        String videoId = incident.getVideoJob().getVideoId();
        Path reportPath = Paths.get(reportsDir, videoId + "_report.html");
        File file = reportPath.toFile();
        if (!file.exists()) {
            throw new ResourceNotFoundException("HTML Report for video " + videoId + " does not exist yet.");
        }
        return new FileSystemResource(file);
    }

    public Resource getReportJson(String incidentId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident " + incidentId + " not found"));
        
        String videoId = incident.getVideoJob().getVideoId();
        Path reportPath = Paths.get(reportsDir, videoId + "_report.json");
        File file = reportPath.toFile();
        if (!file.exists()) {
            throw new ResourceNotFoundException("JSON Report for video " + videoId + " does not exist yet.");
        }
        return new FileSystemResource(file);
    }
}
