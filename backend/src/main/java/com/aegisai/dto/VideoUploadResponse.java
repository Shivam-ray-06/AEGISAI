package com.aegisai.dto;

import com.aegisai.enums.JobStatus;
import java.time.LocalDateTime;

public class VideoUploadResponse {
    private String videoId;
    private String filename;
    private Long fileSizeBytes;
    private Double durationSeconds;
    private Double fps;
    private String resolution;
    private JobStatus status;
    private String previewUrl;
    private LocalDateTime uploadedAt;

    public VideoUploadResponse() {}

    public String getVideoId() { return videoId; }
    public void setVideoId(String videoId) { this.videoId = videoId; }
    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }
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
    public String getPreviewUrl() { return previewUrl; }
    public void setPreviewUrl(String previewUrl) { this.previewUrl = previewUrl; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final VideoUploadResponse r = new VideoUploadResponse();
        public Builder videoId(String id) { r.videoId = id; return this; }
        public Builder filename(String fn) { r.filename = fn; return this; }
        public Builder fileSizeBytes(Long size) { r.fileSizeBytes = size; return this; }
        public Builder durationSeconds(Double dur) { r.durationSeconds = dur; return this; }
        public Builder fps(Double fps) { r.fps = fps; return this; }
        public Builder resolution(String res) { r.resolution = res; return this; }
        public Builder status(JobStatus status) { r.status = status; return this; }
        public Builder previewUrl(String url) { r.previewUrl = url; return this; }
        public Builder uploadedAt(LocalDateTime time) { r.uploadedAt = time; return this; }
        public VideoUploadResponse build() { return r; }
    }
}
