"""OAuth service for managing platform credentials."""

import os
import time
from typing import Dict, Optional, Any, List
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud import secretmanager

class OAuthService:
    """
    Service for managing OAuth credentials and flows.
    
    This service handles the OAuth authentication flow for various platforms,
    including token storage, refresh, and validation.
    """
    
    def __init__(
        self,
        project_id: Optional[str] = None,
        firestore_collection: str = "platform_credentials",
    ):
        """Initialize the OAuth service."""
        self.project_id = project_id or os.environ.get("GOOGLE_CLOUD_PROJECT")
        self.firestore_collection = firestore_collection
        self._initialized = False
        
        # Platform configuration (in a real implementation, this would be more robust)
        self.platforms = {
            "linkedin": {
                "client_id_secret": f"projects/{self.project_id}/secrets/linkedin-client-id/versions/latest",
                "client_secret_secret": f"projects/{self.project_id}/secrets/linkedin-client-secret/versions/latest",
                "auth_url": "https://www.linkedin.com/oauth/v2/authorization",
                "token_url": "https://www.linkedin.com/oauth/v2/accessToken",
                "scopes": ["r_liteprofile", "r_emailaddress", "w_member_social"],
                "redirect_uri": f"https://{self.project_id}.firebaseapp.com/oauth/callback"
            },
            "bluesky": {
                "client_id_secret": f"projects/{self.project_id}/secrets/bluesky-app-password/versions/latest",
                "auth_url": None,  # Bluesky uses app passwords instead of OAuth
                "token_url": None,
                "scopes": [],
                "redirect_uri": None
            }
        }
        
    def initialize(self):
        """Initialize Firebase and Secret Manager clients."""
        if not self._initialized:
            # Initialize Firebase
            try:
                firebase_admin.get_app()
            except ValueError:
                cred = credentials.ApplicationDefault()
                firebase_admin.initialize_app(cred, {
                    'projectId': self.project_id,
                })
            
            # Initialize Firestore client
            self.db = firestore.client()
            
            # Initialize Secret Manager client
            self.secret_client = secretmanager.SecretManagerServiceClient()
            
            self._initialized = True
    
    def _get_secret(self, secret_name: str) -> str:
        """Get a secret from Secret Manager."""
        if not self._initialized:
            self.initialize()
            
        response = self.secret_client.access_secret_version(name=secret_name)
        return response.payload.data.decode("UTF-8")
    
    async def get_auth_url(
        self, 
        platform: str, 
        state: Optional[str] = None,
        extra_params: Optional[Dict[str, str]] = None
    ) -> str:
        """Get the authentication URL for a platform."""
        if not self._initialized:
            self.initialize()
            
        if platform not in self.platforms:
            raise ValueError(f"Unsupported platform: {platform}")
            
        # Bluesky uses app passwords instead of OAuth
        if platform == "bluesky":
            raise ValueError("Bluesky uses app passwords instead of OAuth. Use store_app_password method instead.")
            
        # Get platform configuration
        config = self.platforms[platform]
        
        # Get client ID from Secret Manager
        client_id = self._get_secret(config["client_id_secret"])
        
        # Build auth URL
        params = {
            "client_id": client_id,
            "redirect_uri": config["redirect_uri"],
            "response_type": "code",
            "scope": " ".join(config["scopes"]),
        }
        
        if state:
            params["state"] = state
            
        if extra_params:
            params.update(extra_params)
            
        # Convert params to URL query string
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        
        return f"{config['auth_url']}?{query_string}"