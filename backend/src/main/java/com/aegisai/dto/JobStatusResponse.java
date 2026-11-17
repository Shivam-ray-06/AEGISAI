package com.aegisai.dto;

import com.aegisai.enums.JobStatus;

public class JobStatusResponse {
    private String videoId;
    private JobStatus status;
    private Double progress;
    private String errorMessage;
    private Integer vehiclesCount;
    private Integer pedestriansCount;
    private Integer incidentsCount;
    private String annotatedVideoUrl;

    public JobStatusResponse() {}

    public String getVideoId() { return videoId; }
    public void setVideoId(String videoId) { this.videoId = videoId; }
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
    public String getAnnotatedVideoUrl() { return annotatedVideoUrl; }
    public void setAnnotatedVideoUrl(String annotatedVideoUrl) { this.annotatedVideoUrl = annotatedVideoUrl; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final JobStatusResponse r = new JobStatusResponse();
        public Builder videoId(String id) { r.videoId = id; return this; }
        public Builder status(JobStatus status) { r.status = status; return this; }
        public Builder progress(Double progress) { r.progress = progress; return this; }
        public Builder errorMessage(String msg) { r.errorMessage = msg; return this; }
        public Builder vehiclesCount(Integer c) { r.vehiclesCount = c; return this; }
        public Builder pedestriansCount(Integer c) { r.pedestriansCount = c; return this; }
        public Builder incidentsCount(Integer c) { r.incidentsCount = c; return this; }
        public Builder annotatedVideoUrl(String url) { r.annotatedVideoUrl = url; return this; }
        public JobStatusResponse build() { return r; }
    }
}
