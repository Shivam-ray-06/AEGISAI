package com.aegisai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_assessments")
public class VehicleAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicle_id", length = 32, nullable = false)
    private String vehicleId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "video_id", nullable = false)
    private VideoJob videoJob;

    @Column(name = "vehicle_type", length = 32)
    private String vehicleType;

    @Column(name = "collision_involvement")
    private Boolean collisionInvolvement;

    @Column(name = "detection_confidence")
    private Double detectionConfidence;

    @Column(name = "event_timestamp")
    private Double eventTimestamp;

    @Column(name = "visible_damage_assessment", columnDefinition = "TEXT")
    private String visibleDamageAssessment;

    @Column(name = "damage_severity", length = 128)
    private String damageSeverity;

    @Column(name = "assessment_notes", columnDefinition = "TEXT")
    private String assessmentNotes;

    @Column(name = "review_status", length = 64)
    private String reviewStatus;

    // Structural Impact Deformation & Crush Depth Fields (SID-QE)
    @Column(name = "deformation_percentage")
    private Double deformationPercentage;

    @Column(name = "crush_depth_cm")
    private Double crushDepthCm;

    @Column(name = "impact_zone", length = 64)
    private String impactZone;

    @Column(name = "structural_integrity_index")
    private Double structuralIntegrityIndex;

    @Column(name = "drivability_status", length = 64)
    private String drivabilityStatus;

    @Column(name = "structural_zone_details", columnDefinition = "TEXT")
    private String structuralZoneDetails;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public VehicleAssessment() {}

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }
    public VideoJob getVideoJob() { return videoJob; }
    public void setVideoJob(VideoJob videoJob) { this.videoJob = videoJob; }
    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
    public Boolean getCollisionInvolvement() { return collisionInvolvement; }
    public void setCollisionInvolvement(Boolean collisionInvolvement) { this.collisionInvolvement = collisionInvolvement; }
    public Double getDetectionConfidence() { return detectionConfidence; }
    public void setDetectionConfidence(Double detectionConfidence) { this.detectionConfidence = detectionConfidence; }
    public Double getEventTimestamp() { return eventTimestamp; }
    public void setEventTimestamp(Double eventTimestamp) { this.eventTimestamp = eventTimestamp; }
    public String getVisibleDamageAssessment() { return visibleDamageAssessment; }
    public void setVisibleDamageAssessment(String visibleDamageAssessment) { this.visibleDamageAssessment = visibleDamageAssessment; }
    public String getDamageSeverity() { return damageSeverity; }
    public void setDamageSeverity(String damageSeverity) { this.damageSeverity = damageSeverity; }
    public String getAssessmentNotes() { return assessmentNotes; }
    public void setAssessmentNotes(String assessmentNotes) { this.assessmentNotes = assessmentNotes; }
    public String getReviewStatus() { return reviewStatus; }
    public void setReviewStatus(String reviewStatus) { this.reviewStatus = reviewStatus; }

    public Double getDeformationPercentage() { return deformationPercentage; }
    public void setDeformationPercentage(Double deformationPercentage) { this.deformationPercentage = deformationPercentage; }
    public Double getCrushDepthCm() { return crushDepthCm; }
    public void setCrushDepthCm(Double crushDepthCm) { this.crushDepthCm = crushDepthCm; }
    public String getImpactZone() { return impactZone; }
    public void setImpactZone(String impactZone) { this.impactZone = impactZone; }
    public Double getStructuralIntegrityIndex() { return structuralIntegrityIndex; }
    public void setStructuralIntegrityIndex(Double structuralIntegrityIndex) { this.structuralIntegrityIndex = structuralIntegrityIndex; }
    public String getDrivabilityStatus() { return drivabilityStatus; }
    public void setDrivabilityStatus(String drivabilityStatus) { this.drivabilityStatus = drivabilityStatus; }
    public String getStructuralZoneDetails() { return structuralZoneDetails; }
    public void setStructuralZoneDetails(String structuralZoneDetails) { this.structuralZoneDetails = structuralZoneDetails; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final VehicleAssessment va = new VehicleAssessment();
        public Builder vehicleId(String id) { va.vehicleId = id; return this; }
        public Builder videoJob(VideoJob job) { va.videoJob = job; return this; }
        public Builder vehicleType(String type) { va.vehicleType = type; return this; }
        public Builder collisionInvolvement(Boolean inv) { va.collisionInvolvement = inv; return this; }
        public Builder detectionConfidence(Double conf) { va.detectionConfidence = conf; return this; }
        public Builder eventTimestamp(Double ts) { va.eventTimestamp = ts; return this; }
        public Builder visibleDamageAssessment(String vda) { va.visibleDamageAssessment = vda; return this; }
        public Builder damageSeverity(String ds) { va.damageSeverity = ds; return this; }
        public Builder assessmentNotes(String notes) { va.assessmentNotes = notes; return this; }
        public Builder reviewStatus(String status) { va.reviewStatus = status; return this; }
        public Builder deformationPercentage(Double def) { va.deformationPercentage = def; return this; }
        public Builder crushDepthCm(Double crush) { va.crushDepthCm = crush; return this; }
        public Builder impactZone(String zone) { va.impactZone = zone; return this; }
        public Builder structuralIntegrityIndex(Double index) { va.structuralIntegrityIndex = index; return this; }
        public Builder drivabilityStatus(String drivability) { va.drivabilityStatus = drivability; return this; }
        public Builder structuralZoneDetails(String details) { va.structuralZoneDetails = details; return this; }
        public VehicleAssessment build() { return va; }
    }
}
