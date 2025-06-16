#!/usr/bin/env python3
"""Final LinkedIn OAuth setup with proper scopes."""

import os
from urllib.parse import urlencode
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def generate_linkedin_oauth_url():
    """Generate LinkedIn OAuth URL with correct scopes."""
    client_id = os.getenv("LINKEDIN_CLIENT_ID")
    
    if not client_id:
        print("❌ LinkedIn CLIENT_ID not found in .env file")
        return
    
    # Redirect URI matching your app settings
    redirect_uri = "https://XXX.web.app/oauth/linkedin/callback"
    
    # Updated scopes for LinkedIn API v2
    # Note: Some scopes have changed in the newer API versions
    scopes = [
        "r_liteprofile",           # Read lite profile
        "r_emailaddress",          # Read email address
        "w_member_social",         # Post, comment and like on behalf of member
        "r_organization_social",   # Read organization updates
        "w_organization_social"    # Share on behalf of organizations
    ]
    
    # Build authorization URL
    auth_params = {
        "response_type": "code",
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "scope": " ".join(scopes),
        "state": "XXX"  # Optional state parameter for security
    }
    
    auth_url = f"https://www.linkedin.com/oauth/v2/authorization?{urlencode(auth_params)}"
    
    print("🔗 LinkedIn OAuth Setup - Final Steps")
    print("=" * 50)
    print(f"Client ID: {client_id}")
    print(f"Redirect URI: {redirect_uri}")
    print(f"\nScopes requested:")
    for scope in scopes:
        print(f"  - {scope}")
    
    print("\n📋 Steps to complete OAuth:")
    print("\n1. First, add these scopes to your LinkedIn app:")
    print("   - Go to: https://www.linkedin.com/developers/apps")
    print("   - Select your app")
    print("   - Go to 'Products' section")
    print("   - Enable required products (Marketing Developer Platform, etc.)")
    print("   - Go to 'Auth' tab")
    print("   - Add the OAuth 2.0 scopes listed above")
    
    print("\n2. Visit this authorization URL:")
    print(f"\n{auth_url}")
    
    print("\n3. After authorization, you'll get a code. Exchange it using:")
    
    client_secret = os.getenv("LINKEDIN_CLIENT_SECRET")
    curl_command = f"""
curl -X POST https://www.linkedin.com/oauth/v2/accessToken \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=authorization_code" \\
  -d "code=<YOUR_AUTH_CODE>" \\
  -d "client_id={client_id}" \\
  -d "client_secret={client_secret}" \\
  -d "redirect_uri={redirect_uri}"
"""
    print(curl_command)
    
    print("\n4. Save the access_token in your .env file:")
    print("   LINKEDIN_ACCESS_TOKEN=<your-access-token>")
    
    print("\n5. Get your LinkedIn Organization ID:")
    print("   - Go to your LinkedIn company page")
    print("   - The URL will be: linkedin.com/company/{numeric-id}/")
    print("   - Use the numeric ID (not the vanity URL)")
    print("   - Add it to .env as:")
    print("   LINKEDIN_ORGANIZATION_ID=<numeric-id>")
    
    print("\n📝 Example API call to verify access token:")
    print("""
curl -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \\
     "https://api.linkedin.com/v2/me"
""")

if __name__ == "__main__":
    generate_linkedin_oauth_url()