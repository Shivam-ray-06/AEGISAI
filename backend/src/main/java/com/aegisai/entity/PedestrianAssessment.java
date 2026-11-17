package com.aegisai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pedestrian_assessments")
public class PedestrianAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "person_id", length = 32, nullable = false)
    private String personId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "video_id", nullable = false)
    private VideoJob videoJob;

    @Column(name = "detection_confidence")
    private Double detectionConfidence;

    @Column(name = "event_timestamp")
    private Double eventTimestamp;

    @Column(name = "collision_proximity", length = 128)
    private String collisionProximity;

    @Column(name = "movement_status", length = 128)
    private String movementStatus;

    @Column(name = "warning_level", length = 32)
    private String warningLevel;

    @Column(name = "review_status", length = 64)
    private String reviewStatus;

    @Column(name = "age_disclaimer", length = 128)
    private String ageDisclaimer;

    @Column(name = "height_disclaimer", length = 128)
    private String heightDisclaimer;

    @Column(name = "consciousness_disclaimer", length = 128)
    private String consciousnessDisclaimer;

    @Column(name = "breathing_disclaimer", length = 128)
    private String breathingDisclaimer;

    @Column(name = "injury_disclaimer", length = 256)
    private String injuryDisclaimer;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public PedestrianAssessment() {}

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.ageDisclaimer = "Not estimated.";
        this.heightDisclaimer = "Not estimated.";
        this.consciousnessDisclaimer = "Not determinable from ordinary CCTV.";
        this.breathingDisclaimer = "Not determinable from ordinary CCTV.";
        this.injuryDisclaimer = "Unknown — human emergency assessment required.";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPersonId() { return personId; }
    public void setPersonId(String personId) { this.personId = personId; }
    public VideoJob getVideoJob() { return videoJob; }
    public void setVideoJob(VideoJob videoJob) { this.videoJob = videoJob; }
    public Double getDetectionConfidence() { return detectionConfidence; }
    public void setDetectionConfidence(Double detectionConfidence) { this.detectionConfidence = detectionConfidence; }
    public Double getEventTimestamp() { return eventTimestamp; }
    public void setEventTimestamp(Double eventTimestamp) { this.eventTimestamp = eventTimestamp; }
    public String getCollisionProximity() { return collisionProximity; }
    public void setCollisionProximity(String collisionProximity) { this.collisionProximity = collisionProximity; }
    public String getMovementStatus() { return movementStatus; }
    public void setMovementStatus(String movementStatus) { this.movementStatus = movementStatus; }
    public String getWarningLevel() { return warningLevel; }
    public void setWarningLevel(String warningLevel) { this.warningLevel = warningLevel; }
    public String getReviewStatus() { return reviewStatus; }
    public void setReviewStatus(String reviewStatus) { this.reviewStatus = reviewStatus; }
    public String getAgeDisclaimer() { return ageDisclaimer; }
    public void setAgeDisclaimer(String ageDisclaimer) { this.ageDisclaimer = ageDisclaimer; }
    public String getHeightDisclaimer() { return heightDisclaimer; }
    public void setHeightDisclaimer(String heightDisclaimer) { this.heightDisclaimer = heightDisclaimer; }
    public String getConsciousnessDisclaimer() { return consciousnessDisclaimer; }
    public void setConsciousnessDisclaimer(String consciousnessDisclaimer) { this.consciousnessDisclaimer = consciousnessDisclaimer; }
    public String getBreathingDisclaimer() { return breathingDisclaimer; }
    public void setBreathingDisclaimer(String breathingDisclaimer) { this.breathingDisclaimer = breathingDisclaimer; }
    public String getInjuryDisclaimer() { return injuryDisclaimer; }
    public void setInjuryDisclaimer(String injuryDisclaimer) { this.injuryDisclaimer = injuryDisclaimer; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final PedestrianAssessment pa = new PedestrianAssessment();
        public Builder personId(String id) { pa.personId = id; return this; }
        public Builder videoJob(VideoJob job) { pa.videoJob = job; return this; }
        public Builder detectionConfidence(Double conf) { pa.detectionConfidence = conf; return this; }
        public Builder eventTimestamp(Double ts) { pa.eventTimestamp = ts; return this; }
        public Builder collisionProximity(String prox) { pa.collisionProximity = prox; return this; }
        public Builder movementStatus(String ms) { pa.movementStatus = ms; return this; }
        public Builder warningLevel(String wl) { pa.warningLevel = wl; return this; }
        public Builder reviewStatus(String rs) { pa.reviewStatus = rs; return this; }
        public PedestrianAssessment build() { return pa; }
    }
}
