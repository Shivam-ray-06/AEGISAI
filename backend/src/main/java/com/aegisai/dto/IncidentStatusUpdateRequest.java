package com.aegisai.dto;

import com.aegisai.enums.IncidentStatus;
import jakarta.validation.constraints.NotNull;

public class IncidentStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private IncidentStatus status;
    private String reviewerNotes;

    public IncidentStatusUpdateRequest() {}

    public IncidentStatusUpdateRequest(IncidentStatus status, String reviewerNotes) {
        this.status = status;
        this.reviewerNotes = reviewerNotes;
    }

    public IncidentStatus getStatus() { return status; }
    public void setStatus(IncidentStatus status) { this.status = status; }
    public String getReviewerNotes() { return reviewerNotes; }
    public void setReviewerNotes(String reviewerNotes) { this.reviewerNotes = reviewerNotes; }
}
