import json
import os
from flask import Flask, jsonify, request
import logging

# Setup basic logging to see request details in the terminal
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

@app.before_request
def log_request_info():
    app.logger.debug('--- Incoming Request ---')
    app.logger.debug('Path: %s', request.path)
    app.logger.debug('Headers: %s', request.headers)
    app.logger.debug('----------------------')

# --- Data Loading with Absolute Paths ---
# Get the absolute path of the directory containing this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Go up two levels to the project root
PROJECT_ROOT = os.path.dirname(os.path.dirname(BASE_DIR))

def get_data_path(filename):
    return os.path.join(PROJECT_ROOT, 'data', filename)

def load_data():
    with open(get_data_path('projects.json'), 'r', encoding='utf-8') as f:
        projects = json.load(f)
    with open(get_data_path('brands.json'), 'r', encoding='utf-8') as f:
        brands = json.load(f)
    with open(get_data_path('biddable_spots.json'), 'r', encoding='utf-8') as f:
        spots = json.load(f)
    with open(get_data_path('available_locations.json'), 'r', encoding='utf-8') as f:
        locations = json.load(f)
    with open(get_data_path('heatmap_data.json'), 'r', encoding='utf-8') as f:
        heatmap = json.load(f)
    return projects, brands, spots, locations, heatmap

projects_data, brands_data, spots_data, locations_data, heatmap_data = load_data()

@app.route('/api/hello')
def hello_world():
    return {'message': 'Hello from Backend!'}

@app.route('/api/projects', methods=['GET'])
def get_projects():
    return jsonify(projects_data)

@app.route('/api/match/<int:project_id>', methods=['GET'])
def match_brands(project_id):
    project = next((p for p in projects_data if p['id'] == project_id), None)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    matched_brands = []
    for brand in brands_data:
        score = 0
        reasons = []

        # More sophisticated matching logic
        if brand['target_audience'] == project['target_audience']:
            score += 50
            reasons.append("客群高度吻合")
        
        if project['rent_min'] <= brand['rent_budget'] <= project['rent_max']:
            score += 30
            reasons.append("租金预算匹配")
        
        if brand['area_needed'] <= project['available_area']:
            score += 20
            reasons.append("面积需求符合")

        if score > 50: # Only consider brands with a decent match
            brand_copy = brand.copy()
            brand_copy['match_score'] = score
            brand_copy['reason'] = "、".join(reasons)
            matched_brands.append(brand_copy)
            
    # Sort by score descending
    matched_brands.sort(key=lambda x: x['match_score'], reverse=True)
            
    return jsonify(matched_brands)

# --- Bidding Module Endpoints ---

@app.route('/api/bidding/spots', methods=['GET'])
def get_bidding_spots():
    # Add premium_rate dynamically
    spots_with_premium = []
    for spot in spots_data:
        spot_copy = spot.copy()
        if spot['starting_bid'] > 0:
            premium = ((spot['current_bid'] - spot['starting_bid']) / spot['starting_bid']) * 100
            spot_copy['premium_rate'] = round(premium, 1)
        else:
            spot_copy['premium_rate'] = 0
        spots_with_premium.append(spot_copy)
    return jsonify(spots_with_premium)

@app.route('/api/bidding/bid', methods=['POST'])
def place_bid():
    data = request.get_json()
    spot_id = data.get('spot_id')
    bid_amount = data.get('bid_amount')

    if not spot_id or not bid_amount:
        return jsonify({"error": "Missing spot_id or bid_amount"}), 400

    spot = next((s for s in spots_data if s['id'] == spot_id), None)
    if not spot:
        return jsonify({"error": "Spot not found"}), 404

    if bid_amount >= spot['current_bid'] + spot['bid_increment']:
        spot['current_bid'] = bid_amount
        return jsonify({"success": True, "new_bid": spot['current_bid']})
    else:
        return jsonify({
            "success": False, 
            "message": f"Your bid must be at least {spot['current_bid'] + spot['bid_increment']}"
        }), 400

# --- Location Finder Endpoints ---

@app.route('/api/locations/search', methods=['GET'])
def search_locations():
    query_params = request.args
    city = query_params.get('city')
    area_min = query_params.get('area_min', type=int)
    rent_max = query_params.get('rent_max', type=int)
    location_type = query_params.get('type')

    results = locations_data

    if city:
        results = [loc for loc in results if loc['city'].lower() == city.lower()]
    
    if area_min:
        results = [loc for loc in results if loc['area'] >= area_min]

    if rent_max:
        results = [loc for loc in results if loc['rent'] <= rent_max]

    if location_type:
        results = [loc for loc in results if location_type in loc['suitable_for']]
        
    return jsonify(results)


# --- Heatmap Endpoint ---

@app.route('/api/heatmap', methods=['GET'])
def get_heatmap_data():
    return jsonify(heatmap_data)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
