package com.aegisai.service;

import com.aegisai.client.AiServiceClient;
import com.aegisai.dto.JobStatusResponse;
import com.aegisai.dto.VideoUploadResponse;
import com.aegisai.entity.*;
import com.aegisai.enums.IncidentStatus;
import com.aegisai.enums.JobStatus;
import com.aegisai.exception.ResourceNotFoundException;
import com.aegisai.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@Service
public class VideoService {

    private static final Logger log = LoggerFactory.getLogger(VideoService.class);

    private final VideoJobRepository videoJobRepository;
    private final IncidentRepository incidentRepository;
    private final VehicleAssessmentRepository vehicleAssessmentRepository;
    private final PedestrianAssessmentRepository pedestrianAssessmentRepository;
    private final IncidentTimelineRepository timelineRepository;
    private final AiServiceClient aiServiceClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${aegisai.storage.uploads:/Volumes/Krishu/AEGISAI/storage/uploads}")
    private String uploadsDir;

    @Value("${aegisai.storage.processed:/Volumes/Krishu/AEGISAI/storage/processed}")
    private String processedDir;

    @Value("${aegisai.storage.thumbnails:/Volumes/Krishu/AEGISAI/storage/thumbnails}")
    private String thumbnailsDir;

    public VideoService(VideoJobRepository videoJobRepository,
                        IncidentRepository incidentRepository,
                        VehicleAssessmentRepository vehicleAssessmentRepository,
                        PedestrianAssessmentRepository pedestrianAssessmentRepository,
                        IncidentTimelineRepository timelineRepository,
                        AiServiceClient aiServiceClient) {
        this.videoJobRepository = videoJobRepository;
        this.incidentRepository = incidentRepository;
        this.vehicleAssessmentRepository = vehicleAssessmentRepository;
        this.pedestrianAssessmentRepository = pedestrianAssessmentRepository;
        this.timelineRepository = timelineRepository;
        this.aiServiceClient = aiServiceClient;
    }

    @Transactional
    public VideoUploadResponse uploadVideo(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty video file");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            originalFilename = "uploaded_video.mp4";
        }

        String ext = "";
        int dot = originalFilename.lastIndexOf('.');
        if (dot > 0) {
            ext = originalFilename.substring(dot).toLowerCase();
        }

        if (!List.of(".mp4", ".mov", ".avi", ".mkv").contains(ext)) {
            throw new IllegalArgumentException("Unsupported video format: " + ext + ". Please upload MP4, MOV, or AVI.");
        }

        String videoId = "VID-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Path targetUploadPath = Paths.get(uploadsDir, videoId + ext);
        Files.createDirectories(targetUploadPath.getParent());
        Files.copy(file.getInputStream(), targetUploadPath, StandardCopyOption.REPLACE_EXISTING);

        VideoJob job = VideoJob.builder()
                .videoId(videoId)
                .originalFilename(originalFilename)
                .storagePath(targetUploadPath.toAbsolutePath().toString())
                .fileSizeBytes(file.getSize())
                .status(JobStatus.UPLOADED)
                .progress(0.0)
                .vehiclesCount(0)
                .pedestriansCount(0)
                .incidentsCount(0)
                .build();

        videoJobRepository.save(job);

        return VideoUploadResponse.builder()
                .videoId(videoId)
                .filename(originalFilename)
                .fileSizeBytes(file.getSize())
                .durationSeconds(0.0)
                .fps(0.0)
                .resolution("Analyzing...")
                .status(JobStatus.UPLOADED)
                .previewUrl("/api/v1/videos/" + videoId + "/preview")
                .uploadedAt(job.getCreatedAt())
                .build();
    }

    public List<VideoJob> getAllVideos() {
        return videoJobRepository.findAllByOrderByCreatedAtDesc();
    }

    public VideoJob getVideoJob(String videoId) {
        return videoJobRepository.findById(videoId)
                .orElseThrow(() -> new ResourceNotFoundException("Video job " + videoId + " not found"));
    }

    @Async("videoAnalysisExecutor")
    public void startAnalysis(String videoId) {
        VideoJob job = getVideoJob(videoId);
        job.setStatus(JobStatus.QUEUED);
        job.setProgress(0.05);
        videoJobRepository.save(job);

        try {
            aiServiceClient.triggerAnalysis(videoId, job.getStoragePath());
            job.setStatus(JobStatus.PROCESSING);
            videoJobRepository.save(job);

            boolean completed = false;
            int retries = 0;
            while (!completed && retries < 180) {
                Thread.sleep(2000);
                JsonNode statusNode = aiServiceClient.getJobStatus(videoId);
                if (statusNode != null) {
                    String status = statusNode.path("status").asText();
                    double prog = statusNode.path("progress").asDouble(0.0);
                    job.setProgress(prog);

                    if ("COMPLETED".equalsIgnoreCase(status)) {
                        completed = true;
                        job.setStatus(JobStatus.COMPLETED);
                        job.setProgress(1.0);
                        break;
                    } else if ("FAILED".equalsIgnoreCase(status)) {
                        throw new RuntimeException("AI engine failed: " + statusNode.path("error").asText());
                    }
                    videoJobRepository.save(job);
                }
                retries++;
            }

            if (completed) {
                JsonNode results = aiServiceClient.getJobResults(videoId);
                ingestAnalysisResults(job, results);
            } else {
                job.setStatus(JobStatus.FAILED);
                job.setErrorMessage("Analysis timed out waiting for AI inference engine.");
                videoJobRepository.save(job);
            }

        } catch (Exception e) {
            log.error("Error analyzing video {}: {}", videoId, e.getMessage(), e);
            job.setStatus(JobStatus.FAILED);
            job.setErrorMessage(e.getMessage());
            videoJobRepository.save(job);
        }
    }

    @Transactional
    public void ingestAnalysisResults(VideoJob job, JsonNode results) {
        try {
            JsonNode videoInfo = results.path("videoInfo");
            job.setDurationSeconds(videoInfo.path("durationSec").asDouble(0.0));
            job.setFps(videoInfo.path("fps").asDouble(30.0));
            job.setResolution(videoInfo.path("resolution").asText("N/A"));
            job.setAnnotatedVideoPath(videoInfo.path("annotatedVideoPath").asText());
            job.setThumbnailPath(Paths.get(thumbnailsDir, job.getVideoId() + "_thumb.jpg").toString());

            JsonNode summary = results.path("summary");
            job.setVehiclesCount(summary.path("totalVehiclesTracked").asInt(0));
            job.setPedestriansCount(summary.path("totalPedestriansTracked").asInt(0));
            job.setIncidentsCount(summary.path("suspectedIncidentsCount").asInt(0));
            job.setStatus(JobStatus.COMPLETED);
            job.setProgress(1.0);
            videoJobRepository.save(job);

            // Ingest Incidents
            JsonNode incidentsNode = results.path("incidents");
            if (incidentsNode.isArray()) {
                for (JsonNode inc : incidentsNode) {
                    String incId = inc.path("incidentId").asText();
                    Incident incident = Incident.builder()
                            .incidentId(incId)
                            .videoJob(job)
                            .eventTimestamp(inc.path("eventTimestamp").asDouble(0.0))
                            .involvedVehicles(objectMapper.writeValueAsString(inc.path("involvedVehicleIds")))
                            .nearbyPedestrians(objectMapper.writeValueAsString(inc.path("nearbyPedestrianIds")))
                            .evidenceDetected(objectMapper.writeValueAsString(inc.path("evidenceDetected")))
                            .confidenceScore(inc.path("confidenceScore").asDouble(0.85))
                            .eventDescription(inc.path("eventDescription").asText())
                            .reviewStatus(IncidentStatus.PENDING_VERIFICATION)
                            .build();
                    incidentRepository.save(incident);
                }
            }

            // Ingest Vehicle Assessments
            JsonNode vehNode = results.path("vehicleAssessments");
            if (vehNode.isArray()) {
                for (JsonNode v : vehNode) {
                    VehicleAssessment va = VehicleAssessment.builder()
                            .vehicleId(v.path("vehicleId").asText())
                            .videoJob(job)
                            .vehicleType(v.path("vehicleType").asText("Car"))
                            .collisionInvolvement(v.path("collisionInvolvement").asBoolean(false))
                            .detectionConfidence(v.path("detectionConfidence").asDouble(0.8))
                            .eventTimestamp(v.path("eventTimestamp").asDouble(0.0))
                            .visibleDamageAssessment(v.path("visibleDamageAssessment").asText())
                            .damageSeverity(v.path("damageSeverity").asText("NONE"))
                            .assessmentNotes(v.path("assessmentNotes").asText())
                            .reviewStatus(v.path("reviewStatus").asText("VERIFIED"))
                            .deformationPercentage(v.has("deformationPercentage") ? v.path("deformationPercentage").asDouble(0.0) : 0.0)
                            .crushDepthCm(v.has("crushDepthCm") ? v.path("crushDepthCm").asDouble(0.0) : 0.0)
                            .impactZone(v.path("impactZone").asText("UNDAMAGED"))
                            .structuralIntegrityIndex(v.has("structuralIntegrityIndex") ? v.path("structuralIntegrityIndex").asDouble(100.0) : 100.0)
                            .drivabilityStatus(v.path("drivabilityStatus").asText("OPERATIONAL"))
                            .structuralZoneDetails(v.has("structuralZones") ? v.path("structuralZones").toString() : "{}")
                            .build();
                    vehicleAssessmentRepository.save(va);
                }
            }

            // Ingest Pedestrian Assessments
            JsonNode pedNode = results.path("pedestrianAssessments");
            if (pedNode.isArray()) {
                for (JsonNode p : pedNode) {
                    PedestrianAssessment pa = PedestrianAssessment.builder()
                            .personId(p.path("personId").asText())
                            .videoJob(job)
                            .detectionConfidence(p.path("detectionConfidence").asDouble(0.8))
                            .eventTimestamp(p.path("eventTimestamp").asDouble(0.0))
                            .collisionProximity(p.path("collisionProximity").asText())
                            .movementStatus(p.path("movementStatus").asText())
                            .warningLevel(p.path("warningLevel").asText("GREEN"))
                            .reviewStatus(p.path("reviewStatus").asText("UNINVOLVED_BYSTANDER"))
                            .build();
                    pedestrianAssessmentRepository.save(pa);
                }
            }

            // Ingest Timeline
            JsonNode timelineNode = results.path("timeline");
            if (timelineNode.isArray()) {
                for (JsonNode t : timelineNode) {
                    IncidentTimeline tl = IncidentTimeline.builder()
                            .videoJob(job)
                            .timestampSeconds(t.path("timestamp").asDouble(0.0))
                            .title(t.path("title").asText())
                            .eventType(t.path("type").asText("INFO"))
                            .description(t.path("description").asText())
                            .build();
                    timelineRepository.save(tl);
                }
            }

            log.info("Analysis successfully ingested for videoId {}", job.getVideoId());
        } catch (Exception e) {
            log.error("Failed to ingest analysis results for {}: {}", job.getVideoId(), e.getMessage(), e);
        }
    }

    public JobStatusResponse getJobStatus(String videoId) {
        VideoJob job = getVideoJob(videoId);
        return JobStatusResponse.builder()
                .videoId(videoId)
                .status(job.getStatus())
                .progress(job.getProgress())
                .errorMessage(job.getErrorMessage())
                .vehiclesCount(job.getVehiclesCount())
                .pedestriansCount(job.getPedestriansCount())
                .incidentsCount(job.getIncidentsCount())
                .annotatedVideoUrl("/api/v1/videos/" + videoId + "/annotated")
                .build();
    }
}
