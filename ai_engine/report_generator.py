import json
from pathlib import Path
from typing import Dict, Any

def generate_json_report(analysis_data: Dict[str, Any], output_path: str) -> str:
    """Generates structured JSON report"""
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(analysis_data, f, indent=2)
    return output_path

def generate_html_report(analysis_data: Dict[str, Any], output_path: str) -> str:
    """Generates printable, enterprise-grade emergency incident HTML report"""
    incident = analysis_data.get('incidents', [{}])[0] if analysis_data.get('incidents') else {}
    video_info = analysis_data.get('videoInfo', {})
    stats = analysis_data.get('summary', {})
    vehicles = analysis_data.get('vehicleAssessments', [])
    pedestrians = analysis_data.get('pedestrianAssessments', [])
    
    inc_id = incident.get('incidentId', 'INC-UNKNOWN')
    timestamp_str = incident.get('eventTimestamp', 'N/A')
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AEGISAI Incident Dossier — {inc_id}</title>
    <style>
        :root {{
            --bg-color: #0b0f17;
            --card-bg: #141b26;
            --border-color: #263345;
            --text-primary: #e6edf3;
            --text-secondary: #8b949e;
            --accent-cyan: #00d2ff;
            --critical-red: #ff3b30;
            --warning-amber: #ff9500;
            --success-green: #34c759;
        }}
        @media print {{
            body {{ background: #fff !important; color: #000 !important; }}
            .card {{ border: 1px solid #ccc !important; background: #fafafa !important; color: #000 !important; }}
            .no-print {{ display: none !important; }}
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-primary);
            line-height: 1.5;
            margin: 0;
            padding: 30px;
        }}
        .header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid var(--accent-cyan);
            padding-bottom: 20px;
            margin-bottom: 25px;
        }}
        .brand {{
            font-size: 26px;
            font-weight: 800;
            letter-spacing: 1.5px;
            color: var(--accent-cyan);
        }}
        .subtitle {{
            font-size: 13px;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 1px;
        }}
        .badge {{
            padding: 6px 14px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: bold;
            display: inline-block;
        }}
        .badge-critical {{ background: rgba(255, 59, 48, 0.2); color: var(--critical-red); border: 1px solid var(--critical-red); }}
        .badge-warning {{ background: rgba(255, 149, 0, 0.2); color: var(--warning-amber); border: 1px solid var(--warning-amber); }}
        .badge-green {{ background: rgba(52, 199, 89, 0.2); color: var(--success-green); border: 1px solid var(--success-green); }}
        .grid {{
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 25px;
        }}
        .card {{
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: 16px;
        }}
        .card h4 {{ margin: 0 0 8px 0; font-size: 12px; color: var(--text-secondary); text-transform: uppercase; }}
        .card .value {{ font-size: 22px; font-weight: bold; }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            font-size: 13px;
        }}
        th, td {{
            padding: 10px 12px;
            border-bottom: 1px solid var(--border-color);
            text-align: left;
        }}
        th {{
            background: rgba(255, 255, 255, 0.04);
            color: var(--accent-cyan);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        .disclaimer-box {{
            margin-top: 35px;
            padding: 18px;
            background: rgba(255, 149, 0, 0.08);
            border: 1px solid var(--warning-amber);
            border-radius: 6px;
            font-size: 12px;
            color: #d1d5db;
        }}
        .print-btn {{
            background: var(--accent-cyan);
            color: #000;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            margin-bottom: 20px;
        }}
    </style>
</head>
<body>
    <button class="print-btn no-print" onclick="window.print()">Print / Save as PDF</button>

    <div class="header">
        <div>
            <div class="brand">AEGISAI :: EMERGENCY INCIDENT DOSSIER</div>
            <div class="subtitle">Artificial Emergency Guidance & Intelligent Surveillance using AI</div>
        </div>
        <div>
            <span class="badge badge-critical">{incident.get('reviewStatus', 'PENDING_VERIFICATION')}</span>
        </div>
    </div>

    <div class="grid">
        <div class="card">
            <h4>Incident ID</h4>
            <div class="value" style="color: var(--accent-cyan); font-size: 18px;">{inc_id}</div>
        </div>
        <div class="card">
            <h4>Event Timestamp</h4>
            <div class="value">{timestamp_str}s</div>
        </div>
        <div class="card">
            <h4>Detection Confidence</h4>
            <div class="value">{float(incident.get('confidenceScore', 0.85))*100:.1f}%</div>
        </div>
        <div class="card">
            <h4>Vehicles / Pedestrians</h4>
            <div class="value">{stats.get('totalVehiclesTracked', 0)} / {stats.get('totalPedestriansTracked', 0)}</div>
        </div>
    </div>

    <div class="card" style="margin-bottom: 25px;">
        <h3 style="margin-top: 0; color: var(--accent-cyan);">Video Telemetry & Source Metadata</h3>
        <table style="width: 100%;">
            <tr><td><strong>Source Video File</strong></td><td>{video_info.get('filename', 'video.mp4')}</td><td><strong>Duration</strong></td><td>{video_info.get('durationSec', 0):.2f}s</td></tr>
            <tr><td><strong>Resolution</strong></td><td>{video_info.get('resolution', 'N/A')}</td><td><strong>FPS</strong></td><td>{video_info.get('fps', 0):.2f}</td></tr>
            <tr><td><strong>Analysis Model</strong></td><td>YOLOv8 + ByteTrack (PyTorch MPS)</td><td><strong>Generated On</strong></td><td>{analysis_data.get('timestamp', 'N/A')}</td></tr>
        </table>
    </div>

    <div class="card" style="margin-bottom: 25px;">
        <h3 style="margin-top: 0; color: var(--accent-cyan);">Vehicle Intelligence & Damage Profile</h3>
        <table>
            <thead>
                <tr>
                    <th>Vehicle ID</th>
                    <th>Type</th>
                    <th>Collision Involvement</th>
                    <th>Confidence</th>
                    <th>Damage Assessment</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
"""
    for v in vehicles:
        inv_badge = '<span class="badge badge-critical">INVOLVED</span>' if v.get('collisionInvolvement') else '<span class="badge badge-green">SAFE</span>'
        html += f"""
                <tr>
                    <td><strong>{v.get('vehicleId')}</strong></td>
                    <td>{v.get('vehicleType')}</td>
                    <td>{inv_badge}</td>
                    <td>{float(v.get('detectionConfidence', 0))*100:.0f}%</td>
                    <td>{v.get('visibleDamageAssessment')}</td>
                    <td>{v.get('reviewStatus')}</td>
                </tr>
"""
    html += """
            </tbody>
        </table>
    </div>

    <div class="card" style="margin-bottom: 25px;">
        <h3 style="margin-top: 0; color: var(--accent-cyan);">Pedestrian & Victim Intelligence</h3>
        <table>
            <thead>
                <tr>
                    <th>Person ID</th>
                    <th>Confidence</th>
                    <th>Proximity Zone</th>
                    <th>Movement Status</th>
                    <th>Review Warning</th>
                    <th>Medical Disclaimer</th>
                </tr>
            </thead>
            <tbody>
"""
    for p in pedestrians:
        warn_badge = '<span class="badge badge-critical">CRITICAL</span>' if p.get('warningLevel') == 'RED' else ('<span class="badge badge-warning">ALERT</span>' if p.get('warningLevel') == 'AMBER' else '<span class="badge badge-green">BYSTANDER</span>')
        html += f"""
                <tr>
                    <td><strong>{p.get('personId')}</strong></td>
                    <td>{float(p.get('detectionConfidence', 0))*100:.0f}%</td>
                    <td>{p.get('collisionProximity')}</td>
                    <td>{p.get('movementStatus')}</td>
                    <td>{warn_badge}</td>
                    <td>{p.get('medicalDisclaimer', {}).get('injuryStatus', 'Human assessment required')}</td>
                </tr>
"""
    html += f"""
            </tbody>
        </table>
    </div>

    <div class="disclaimer-box">
        <h4 style="margin: 0 0 6px 0; color: var(--warning-amber); text-transform: uppercase;">Ethical & Engineering Safety Limitations</h4>
        <p style="margin: 0;">
            This document is generated by AEGISAI automated experimental computer vision models. 
            <strong>YOLO detections and kinematic estimations do not establish legal liability or confirmed medical diagnostics.</strong>
            Ordinary CCTV video cannot determine consciousness, breathing, or internal trauma. All candidate flags must undergo independent human forensic review and certified emergency medical response verification before action.
        </p>
    </div>
</body>
</html>
"""
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)
    return output_path
