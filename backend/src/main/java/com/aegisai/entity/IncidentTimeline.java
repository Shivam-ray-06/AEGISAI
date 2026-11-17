package com.aegisai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "incident_timelines")
public class IncidentTimeline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "video_id", nullable = false)
    private VideoJob videoJob;

    @Column(name = "timestamp_seconds")
    private Double timestampSeconds;

    @Column(name = "title", length = 128)
    private String title;

    @Column(name = "event_type", length = 32)
    private String eventType;

    @Column(name = "description", length = 1024)
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public IncidentTimeline() {}

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public VideoJob getVideoJob() { return videoJob; }
    public void setVideoJob(VideoJob videoJob) { this.videoJob = videoJob; }
    public Double getTimestampSeconds() { return timestampSeconds; }
    public void setTimestampSeconds(Double timestampSeconds) { this.timestampSeconds = timestampSeconds; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final IncidentTimeline it = new IncidentTimeline();
        public Builder videoJob(VideoJob job) { it.videoJob = job; return this; }
        public Builder timestampSeconds(Double ts) { it.timestampSeconds = ts; return this; }
        public Builder title(String title) { it.title = title; return this; }
        public Builder eventType(String type) { it.eventType = type; return this; }
        public Builder description(String desc) { it.description = desc; return this; }
        public IncidentTimeline build() { return it; }
    }
}
