from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from engine import SurveillanceEngine
import os
import uuid
import json
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize Engine
engine = SurveillanceEngine(model_size='s')

@app.route('/')
def health_check():
    return jsonify({
        'status': 'OPERATIONAL',
        'service': 'AEGIS_SENTINEL_BACKEND',
        'version': '3.1.2'
    })

@app.route('/diagnostics')
def diagnostics():
    return jsonify(engine.get_diagnostics())

@app.route('/models')
def model_info():
    m_size = "Small" if 'yolov8s' in engine.model_path else "Large"
    return jsonify({
        'primary_engine': f'YOLOv8{m_size[0].lower()}',
        'rationale': f'Using {m_size} model for optimized CPU performance/accuracy balance',
        'custom_layers': ['Signature_Recognition', 'Spectral_Fusion']
    })

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400
    
    # Save file
    filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    try:
        # Get optional parameters
        enhance_night = request.form.get('enhance') == 'true'
        fusion_mode = request.form.get('fusion_mode', 'rgb')
        roi_json = request.form.get('roi')
        roi = json.loads(roi_json) if roi_json else None
        
        # Perform Analysis
        results = engine.analyze_image(filepath, enhance_night=enhance_night, fusion_mode=fusion_mode, roi=roi)
        results['image_url'] = results.get('processed_url', f"/uploads/{filename}")
        return jsonify(results)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/process-video', methods=['POST'])
def process_video():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    try:
        # Process video tracking
        track_data = engine.process_video(filepath, app.config['UPLOAD_FOLDER'])
        track_data['video_url'] = f'/uploads/{filename}'
        track_data['message'] = 'VIDEO_ANALYSIS_SYNCED_V3.4'
        
        return jsonify(track_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/uploads/<path:filename>')
def serve_uploads(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='127.0.0.1', use_reloader=False)
