package com.aegisai.service;

import com.aegisai.entity.Incident;
import com.aegisai.entity.IncidentTimeline;
import com.aegisai.enums.IncidentStatus;
import com.aegisai.exception.ResourceNotFoundException;
import com.aegisai.repository.IncidentRepository;
import com.aegisai.repository.IncidentTimelineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final IncidentTimelineRepository timelineRepository;

    public IncidentService(IncidentRepository incidentRepository, IncidentTimelineRepository timelineRepository) {
        this.incidentRepository = incidentRepository;
        this.timelineRepository = timelineRepository;
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAllByOrderByCreatedAtDesc();
    }

    public Incident getIncident(String incidentId) {
        return incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident " + incidentId + " not found"));
    }

    @Transactional
    public Incident updateIncidentStatus(String incidentId, IncidentStatus newStatus) {
        Incident incident = getIncident(incidentId);
        incident.setReviewStatus(newStatus);
        return incidentRepository.save(incident);
    }

    public List<IncidentTimeline> getTimelineForIncident(String incidentId) {
        Incident incident = getIncident(incidentId);
        return timelineRepository.findByVideoJob_VideoIdOrderByTimestampSecondsAsc(
                incident.getVideoJob().getVideoId());
    }
}
