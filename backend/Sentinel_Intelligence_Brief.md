# Sentinel Intelligence Brief: Neural Architecture v3.1

This document provides a technical overview of the models used in the **Aegis Border Sentinel** and the rationale behind their selection.

---

## 1. Neural Core: YOLOv8l (Large)
The primary detection engine is based on the **YOLOv8l** (Large) architecture developed by Ultralytics.

### Why YOLOv8l?
*   **Optimal Balance**: Unlike YOLOv8n (Nano), which is optimized for mobile speed but lacks precision in complex environments, the **Large** variant offers the depth necessary to detect small tactical items (backpacks, cell phones) at distance.
*   **Spectral Resilience**: Large models generalize better when processing augmented streams like **Night Vision** (CLAHE) and **Thermal Fusion**.
*   **Precision vs. Speed**: While **YOLOv8x** (Extra Large) is more accurate, its inference time (approx. 1.5s on CPU) is too slow for "real-time" border alerts. YOLOv8l hits a "sweet spot" at ~800ms per frame on standard hardware.

---

## 2. Signature Recognition Layer
Instead of just counting people, we implemented a **Tactical Signature Filter**.

### The Logic
If the model detects a `person` AND objects like `backpack` or `cell phone` in the same frame, the system automatically elevates the class to **`POTENTIAL_COMBATANT`**.
*   **Rationale**: Standard border crossings may involve civilians, but tactical gear signatures coupled with person silhouettes indicate higher risk profiles in restricted zones.

---

## 3. Multi-Spectral Fusion Logic
We simulate advanced sensors using computer vision transformations:

### Night Mode (CLAHE + Gamma)
*   **Physics**: We use **Contrast Limited Adaptive Histogram Equalization**. This localizes contrast enhancement, preventing "white-out" from lights while revealing shadows.
*   **Shadow Recovery**: A 1.5 Gamma correction is applied to recover details in the 0-50 intensity range.

### Thermal Fusion (Spectral Mapping)
*   **Implementation**: A **Jet-Map LUT** (Look-Up Table) is applied to a Gaussian-blurred grayscale stream.
*   **Why?**: High-intensity areas (human body heat) are mapped to warm colors (Red/Yellow), while background vegetation is mapped to cool colors (Blue). This simulates FLIR (Forward Looking Infrared) without requiring expensive hardware.

---

## 4. Weighted Threat Engine
The system uses a **multi-factor heuristic** for its final report:
- **Object Weight**: People/Trucks (0.4 - 0.5) > Cars (0.3).
- **ROI Bonus**: Any detection within a user-drawn **Virtual Fence** receives a +0.5 threat multiplier.
- **Scene Context**: Detections in "Forest" environments trigger higher baseline anxiety than "Open Land."

---

## 5. Verification Tools
You can verify the backend integrity at any time using:
- `GET /`: Basic operational status.
- `GET /diagnostics`: Full architectural and model health.
- `GET /models`: Neural engine specifications.
