#!/usr/bin/env python3
"""Generate LinkedIn OAuth URL."""

import os
from urllib.parse import urlencode
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def generate_linkedin_oauth_url():
    """Generate LinkedIn OAuth URL."""
    client_id = os.getenv("LINKEDIN_CLIENT_ID")
    
    if not client_id:
        print("❌ LinkedIn CLIENT_ID not found in .env file")
        return
    
    # Redirect URI - update this to match your Firebase hosting URL
    redirect_uri = "https://XXX.web.app/oauth/linkedin/callback"
    
    # Build authorization URL
    auth_params = {
        "response_type": "code",
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "scope": "r_liteprofile r_emailaddress w_member_social r_organization_social w_organization_social"
    }
    
    auth_url = f"https://www.linkedin.com/oauth/v2/authorization?{urlencode(auth_params)}"
    
    print("🔗 LinkedIn OAuth Setup")
    print("=" * 50)
    print(f"Client ID: {client_id}")
    print(f"\nRedirect URI: {redirect_uri}")
    print("\n⚠️  Important Steps:")
    print("1. Add this redirect URI to your LinkedIn app:")
    print("   - Go to: https://www.linkedin.com/developers/apps")
    print("   - Select your app")
    print("   - Go to 'Auth' tab")
    print("   - Add the redirect URI to 'Authorized redirect URLs'")
    print("\n2. Authorize your app by visiting this URL:")
    print(f"\n{auth_url}")
    print("\n3. After authorization, you'll be redirected to a URL with a 'code' parameter")
    print("4. Copy that code value")
    print("\n5. Get your access token with this curl command:")
    
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
    print("\n6. Save the access_token from the response in your .env file as:")
    print("   LINKEDIN_ACCESS_TOKEN=<your-access-token>")
    
    print("\n7. Get your LinkedIn Organization ID:")
    print("   - Go to your LinkedIn company page")
    print("   - Click on 'Admin tools'")
    print("   - The URL will contain the organization ID")
    print("   - Add it to your .env file as:")
    print("   LINKEDIN_ORGANIZATION_ID=<your-org-id>")

if __name__ == "__main__":
    generate_linkedin_oauth_url()