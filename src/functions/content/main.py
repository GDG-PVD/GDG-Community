"""Firebase Cloud Function for generating social media content."""

import functions_framework
from firebase_admin import initialize_app, firestore
from google.cloud import aiplatform
from vertexai.generative_models import GenerativeModel
import json
import os

# Initialize Firebase
initialize_app()

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
        
        # Validate required fields
        if not event_data or not platform or not chapter_id:
            return (json.dumps({
                'error': 'Missing required fields: event, platform, or chapter_id'
            }), 400, headers)
            
        # Get chapter brand voice from Firestore
        db = firestore.client()
        chapter_doc = db.collection('chapters').document(chapter_id).get()
        
        if not chapter_doc.exists:
            return (json.dumps({
                'error': f'Chapter not found: {chapter_id}'
            }), 404, headers)
            
        chapter_data = chapter_doc.to_dict()
        brand_voice = chapter_data.get('brand_voice', {})
        
        # Initialize Vertex AI
        aiplatform.init(project=os.environ.get('GOOGLE_CLOUD_PROJECT'))
        
        # Create the generative model
        model = GenerativeModel("gemini-2.0-pro")
        
        # Create the system prompt
        system_prompt = f"""
        You are a social media content creator for Google Developer Group (GDG) {chapter_id.split('-')[1].capitalize()}.
        
        Voice and Tone:
        - {brand_voice.get('tone', 'Friendly, approachable, technically precise')}
        - {brand_voice.get('style', 'Brief paragraphs, use emojis sparingly, include calls-to-action')}
        
        Generate content for {platform} with the appropriate format, length, and style for that platform.
        """
        
        # Create the user prompt with event details
        user_prompt = f"""
        Create a {platform} post for this event:
        
        Title: {event_data.get('title')}
        Date: {event_data.get('date')}
        Time: {event_data.get('time')}
        Location: {event_data.get('location')}
        Description: {event_data.get('description')}
        Registration Link: {event_data.get('link')}
        
        Platform: {platform}
        """
        
        # Generate content
        response = model.generate_content(
            contents=[system_prompt, user_prompt]
        )
        
        # Extract the generated content
        generated_content = response.text
        
        # Return the generated content
        return (json.dumps({
            'content': generated_content,
            'platform': platform,
            'event_id': event_data.get('id')
        }), 200, headers)
        
    except Exception as e:
        return (json.dumps({
            'error': str(e)
        }), 500, headers)
