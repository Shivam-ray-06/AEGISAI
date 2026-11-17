package com.aegisai.entity;

import com.aegisai.enums.JobStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "video_jobs")
public class VideoJob {

    @Id
    @Column(name = "video_id", length = 64, nullable = false, unique = true)
    private String videoId;

    @Column(name = "original_filename", nullable = false)
    private String originalFilename;

    @Column(name = "storage_path", nullable = false, length = 1024)
    private String storagePath;

    @Column(name = "annotated_video_path", length = 1024)
    private String annotatedVideoPath;

    @Column(name = "thumbnail_path", length = 1024)
    private String thumbnailPath;

    @Column(name = "file_size_bytes")
    private Long fileSizeBytes;

    @Column(name = "duration_seconds")
    private Double durationSeconds;

    @Column(name = "fps")
    private Double fps;

    @Column(name = "resolution", length = 32)
    private String resolution;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    private JobStatus status;

    @Column(name = "progress")
    private Double progress;

    @Column(name = "error_message", length = 2048)
    private String errorMessage;

    @Column(name = "vehicles_count")
    private Integer vehiclesCount;

    @Column(name = "pedestrians_count")
    private Integer pedestriansCount;

    @Column(name = "incidents_count")
    private Integer incidentsCount;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public VideoJob() {}

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = JobStatus.UPLOADED;
        if (this.progress == null) this.progress = 0.0;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getVideoId() { return videoId; }
    public void setVideoId(String videoId) { this.videoId = videoId; }
    public String getOriginalFilename() { return originalFilename; }
    public void setOriginalFilename(String originalFilename) { this.originalFilename = originalFilename; }
    public String getStoragePath() { return storagePath; }
    public void setStoragePath(String storagePath) { this.storagePath = storagePath; }
    public String getAnnotatedVideoPath() { return annotatedVideoPath; }
    public void setAnnotatedVideoPath(String annotatedVideoPath) { this.annotatedVideoPath = annotatedVideoPath; }
    public String getThumbnailPath() { return thumbnailPath; }
    public void setThumbnailPath(String thumbnailPath) { this.thumbnailPath = thumbnailPath; }
    public Long getFileSizeBytes() { return fileSizeBytes; }
    public void setFileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }
    public Double getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Double durationSeconds) { this.durationSeconds = durationSeconds; }
    public Double getFps() { return fps; }
    public void setFps(Double fps) { this.fps = fps; }
    public String getResolution() { return resolution; }
    public void setResolution(String resolution) { this.resolution = resolution; }
    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }
    public Double getProgress() { return progress; }
    public void setProgress(Double progress) { this.progress = progress; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    public Integer getVehiclesCount() { return vehiclesCount; }
    public void setVehiclesCount(Integer vehiclesCount) { this.vehiclesCount = vehiclesCount; }
    public Integer getPedestriansCount() { return pedestriansCount; }
    public void setPedestriansCount(Integer pedestriansCount) { this.pedestriansCount = pedestriansCount; }
    public Integer getIncidentsCount() { return incidentsCount; }
    public void setIncidentsCount(Integer incidentsCount) { this.incidentsCount = incidentsCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final VideoJob job = new VideoJob();
        public Builder videoId(String id) { job.videoId = id; return this; }
        public Builder originalFilename(String name) { job.originalFilename = name; return this; }
        public Builder storagePath(String path) { job.storagePath = path; return this; }
        public Builder annotatedVideoPath(String path) { job.annotatedVideoPath = path; return this; }
        public Builder thumbnailPath(String path) { job.thumbnailPath = path; return this; }
        public Builder fileSizeBytes(Long size) { job.fileSizeBytes = size; return this; }
        public Builder durationSeconds(Double dur) { job.durationSeconds = dur; return this; }
        public Builder fps(Double fps) { job.fps = fps; return this; }
        public Builder resolution(String res) { job.resolution = res; return this; }
        public Builder status(JobStatus status) { job.status = status; return this; }
        public Builder progress(Double prog) { job.progress = prog; return this; }
        public Builder vehiclesCount(Integer count) { job.vehiclesCount = count; return this; }
        public Builder pedestriansCount(Integer count) { job.pedestriansCount = count; return this; }
        public Builder incidentsCount(Integer count) { job.incidentsCount = count; return this; }
        public VideoJob build() { return job; }
    }
}
