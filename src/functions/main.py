"""Firebase Cloud Functions for GDG Community Companion."""

import functions_framework
from firebase_admin import initialize_app, firestore
from google.cloud import aiplatform
import json
import os

# Initialize Firebase
initialize_app()
db = firestore.client()

@functions_framework.http
def generate_social_content(request):
    """
    Generate social media content based on event data.
    
    This Cloud Function accepts event data and generates optimized social media
    content for various platforms.
    
    Args:
        request: HTTP request containing event data and platform info
        
    Returns:
        JSON response with generated content
    """
    # Set CORS headers for preflight requests
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)
    
    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }
    
    # Get request data
    try:
        request_json = request.get_json()
        
        # Extract required fields
        event_data = request_json.get('event')
        platform = request_json.get('platform')
        chapter_id = request_json.get('chapter_id')
        
        if not all([event_data, platform, chapter_id]):
            return (
                json.dumps({"error": "Missing required fields: event, platform, or chapter_id"}),
                400,
                headers
            )
        
        # Generate content (placeholder for now)
        generated_content = {
            "platform": platform,
            "chapter_id": chapter_id,
            "event_title": event_data.get("title", "GDG Event"),
            "content": f"Join us for {event_data.get('title', 'our upcoming event')}! 🚀\n\n"
                      f"{event_data.get('description', '')}\n\n"
                      f"Date: {event_data.get('date', 'TBD')}\n"
                      f"Time: {event_data.get('time', 'TBD')}\n\n"
                      f"#GDG #GoogleDevelopers #TechCommunity",
            "status": "success"
        }
        
        return (json.dumps(generated_content), 200, headers)
        
    except Exception as e:
        return (
            json.dumps({"error": str(e)}),
            500,
            headers
        )

@functions_framework.http
def health_check(request):
    """Simple health check endpoint."""
    headers = {'Access-Control-Allow-Origin': '*'}
    return (json.dumps({"status": "healthy"}), 200, headers)
