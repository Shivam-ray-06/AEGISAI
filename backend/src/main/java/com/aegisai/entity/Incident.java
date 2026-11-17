package com.aegisai.entity;

import com.aegisai.enums.IncidentStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "incidents")
public class Incident {

    @Id
    @Column(name = "incident_id", length = 64, nullable = false, unique = true)
    private String incidentId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "video_id", nullable = false)
    private VideoJob videoJob;

    @Column(name = "event_timestamp")
    private Double eventTimestamp;

    @Column(name = "involved_vehicles", columnDefinition = "TEXT")
    private String involvedVehicles;

    @Column(name = "nearby_pedestrians", columnDefinition = "TEXT")
    private String nearbyPedestrians;

    @Column(name = "evidence_detected", columnDefinition = "TEXT")
    private String evidenceDetected;

    @Column(name = "confidence_score")
    private Double confidenceScore;

    @Column(name = "event_description", columnDefinition = "TEXT")
    private String eventDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "review_status", length = 32, nullable = false)
    private IncidentStatus reviewStatus;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Incident() {}

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.reviewStatus == null) this.reviewStatus = IncidentStatus.PENDING_VERIFICATION;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public String getIncidentId() { return incidentId; }
    public void setIncidentId(String incidentId) { this.incidentId = incidentId; }
    public VideoJob getVideoJob() { return videoJob; }
    public void setVideoJob(VideoJob videoJob) { this.videoJob = videoJob; }
    public Double getEventTimestamp() { return eventTimestamp; }
    public void setEventTimestamp(Double eventTimestamp) { this.eventTimestamp = eventTimestamp; }
    public String getInvolvedVehicles() { return involvedVehicles; }
    public void setInvolvedVehicles(String involvedVehicles) { this.involvedVehicles = involvedVehicles; }
    public String getNearbyPedestrians() { return nearbyPedestrians; }
    public void setNearbyPedestrians(String nearbyPedestrians) { this.nearbyPedestrians = nearbyPedestrians; }
    public String getEvidenceDetected() { return evidenceDetected; }
    public void setEvidenceDetected(String evidenceDetected) { this.evidenceDetected = evidenceDetected; }
    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
    public String getEventDescription() { return eventDescription; }
    public void setEventDescription(String eventDescription) { this.eventDescription = eventDescription; }
    public IncidentStatus getReviewStatus() { return reviewStatus; }
    public void setReviewStatus(IncidentStatus reviewStatus) { this.reviewStatus = reviewStatus; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Incident inc = new Incident();
        public Builder incidentId(String id) { inc.incidentId = id; return this; }
        public Builder videoJob(VideoJob job) { inc.videoJob = job; return this; }
        public Builder eventTimestamp(Double ts) { inc.eventTimestamp = ts; return this; }
        public Builder involvedVehicles(String v) { inc.involvedVehicles = v; return this; }
        public Builder nearbyPedestrians(String p) { inc.nearbyPedestrians = p; return this; }
        public Builder evidenceDetected(String e) { inc.evidenceDetected = e; return this; }
        public Builder confidenceScore(Double score) { inc.confidenceScore = score; return this; }
        public Builder eventDescription(String desc) { inc.eventDescription = desc; return this; }
        public Builder reviewStatus(IncidentStatus status) { inc.reviewStatus = status; return this; }
        public Incident build() { return inc; }
    }
}
