package com.aegisai.controller;

import com.aegisai.dto.ApiResponse;
import com.aegisai.dto.JobStatusResponse;
import com.aegisai.dto.VideoUploadResponse;
import com.aegisai.entity.VideoJob;
import com.aegisai.exception.ResourceNotFoundException;
import com.aegisai.service.VideoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/videos")
@Tag(name = "Video Processing", description = "Video ingestion, processing, streaming, and results")
public class VideoController {

    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload CCTV/dashcam traffic video")
    public ResponseEntity<ApiResponse<VideoUploadResponse>> uploadVideo(@RequestParam("file") MultipartFile file) throws IOException {
        VideoUploadResponse response = videoService.uploadVideo(file);
        return ResponseEntity.ok(ApiResponse.success(response, "Video uploaded successfully"));
    }

    @GetMapping
    @Operation(summary = "List all registered video processing jobs")
    public ResponseEntity<ApiResponse<List<VideoJob>>> getAllVideos() {
        return ResponseEntity.ok(ApiResponse.success(videoService.getAllVideos()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get video processing job details")
    public ResponseEntity<ApiResponse<VideoJob>> getVideoById(@PathVariable("id") String id) {
        return ResponseEntity.ok(ApiResponse.success(videoService.getVideoJob(id)));
    }

    @PostMapping("/{id}/analyze")
    @Operation(summary = "Trigger asynchronous AI video analysis")
    public ResponseEntity<ApiResponse<JobStatusResponse>> startAnalysis(@PathVariable("id") String id) {
        videoService.startAnalysis(id);
        return ResponseEntity.ok(ApiResponse.success(videoService.getJobStatus(id), "Analysis queued successfully"));
    }

    @GetMapping("/{id}/status")
    @Operation(summary = "Get analysis processing status and progress")
    public ResponseEntity<ApiResponse<JobStatusResponse>> getStatus(@PathVariable("id") String id) {
        return ResponseEntity.ok(ApiResponse.success(videoService.getJobStatus(id)));
    }

    @GetMapping("/{id}/annotated")
    @Operation(summary = "Stream generated annotated video (H.264 MP4)")
    public ResponseEntity<Resource> getAnnotatedVideo(@PathVariable("id") String id) {
        VideoJob job = videoService.getVideoJob(id);
        if (job.getAnnotatedVideoPath() == null) {
            throw new ResourceNotFoundException("Annotated video for " + id + " has not been processed yet.");
        }
        File file = new File(job.getAnnotatedVideoPath());
        if (!file.exists()) {
            throw new ResourceNotFoundException("Annotated video file not found at " + job.getAnnotatedVideoPath());
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + id + "_annotated.mp4\"")
                .contentType(MediaType.parseMediaType("video/mp4"))
                .body(new FileSystemResource(file));
    }

    @GetMapping("/{id}/preview")
    @Operation(summary = "Stream original uploaded video for pre-analysis preview")
    public ResponseEntity<Resource> getPreviewVideo(@PathVariable("id") String id) {
        VideoJob job = videoService.getVideoJob(id);
        File file = new File(job.getStoragePath());
        if (!file.exists()) {
            throw new ResourceNotFoundException("Original video file not found at " + job.getStoragePath());
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + job.getOriginalFilename() + "\"")
                .contentType(MediaType.parseMediaType("video/mp4"))
                .body(new FileSystemResource(file));
    }

    @GetMapping("/{id}/thumbnail")
    @Operation(summary = "Get video thumbnail frame image")
    public ResponseEntity<Resource> getThumbnail(@PathVariable("id") String id) {
        VideoJob job = videoService.getVideoJob(id);
        if (job.getThumbnailPath() == null) {
            throw new ResourceNotFoundException("Thumbnail not available for " + id);
        }
        File file = new File(job.getThumbnailPath());
        if (!file.exists()) {
            throw new ResourceNotFoundException("Thumbnail file not found at " + job.getThumbnailPath());
        }
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(new FileSystemResource(file));
    }
}
