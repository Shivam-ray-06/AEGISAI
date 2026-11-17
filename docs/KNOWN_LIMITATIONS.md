# AEGISAI — Known Limitations & Forensic Guidelines

In compliance with strict engineering ethics and computer vision safety principles, the following limitations are formally documented:

## 1. Visual Damage Classification
- Standard YOLO detection models classify object locations and categories (e.g. Car, Truck, Bus); they do **not** measure internal mechanical damage or precise deformation percentages.
- The system flags involved vehicles for certified manual inspection and will display: *"Vehicle damage assessment unavailable — manual visual inspection required"* when custom pixel-level damage segmentation models are not active.

## 2. Pedestrian Consciousness & Vital Signs
- Ordinary 2D surveillance cameras (CCTV or dashcam) **cannot** determine vital signs, consciousness, pulse, breathing, or internal trauma.
- Detected movement or absence of movement across observation windows is purely kinematic and must never be cited as medical proof of consciousness or injury.
- All pedestrian flags are triage recommendations for human emergency first responders.

## 3. Camera Motion & Egocentric Perspectives
- Moving cameras (such as dashcams on turning vehicles) introduce apparent optical flow motion across background objects. While ByteTrack accounts for kalman-filtered bounding box trajectories, extreme camera shakes or occlusion can temporarily interrupt tracking IDs.

## 4. Local Execution Scope
- This version is fully optimized for local execution on macOS (MacBook Air M2). Live RTSP IP camera streaming, distributed Kubernetes deployment, and automated SMS/911 dispatch gateways are reserved for future production phases.
