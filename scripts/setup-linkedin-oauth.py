#!/usr/bin/env python3
"""Helper script to set up LinkedIn OAuth."""

import os
import webbrowser
from urllib.parse import urlencode
from pathlib import Path

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

def setup_linkedin_oauth():
    """Guide through LinkedIn OAuth setup."""
    client_id = os.getenv("LINKEDIN_CLIENT_ID")
    client_secret = os.getenv("LINKEDIN_CLIENT_SECRET")
    
    if not client_id or not client_secret:
        print("❌ LinkedIn CLIENT_ID or CLIENT_SECRET not found in .env file")
        return
    
    print("🔗 LinkedIn OAuth Setup")
    print("=" * 40)
    print(f"Client ID: {client_id}")
    print(f"Client Secret: {client_secret[:10]}...")
    
    # Redirect URI - update this to match your Firebase hosting URL
    redirect_uri = "https://XXX.web.app/oauth/linkedin/callback"
    
    print(f"\nRedirect URI: {redirect_uri}")
    print("\n⚠️  Important: Make sure this redirect URI is added to your LinkedIn app!")
    print("1. Go to: https://www.linkedin.com/developers/apps")
    print("2. Select your app")
    print("3. Go to 'Auth' tab")
    print("4. Add the redirect URI to 'Authorized redirect URLs'")
    
    input("\nPress Enter when you've added the redirect URI...")
    
    # Build authorization URL
    auth_params = {
        "response_type": "code",
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "scope": "r_liteprofile r_emailaddress w_member_social r_organization_social w_organization_social"
    }
    
    auth_url = f"https://www.linkedin.com/oauth/v2/authorization?{urlencode(auth_params)}"
    
    print(f"\n🌐 Opening authorization URL in browser...")
    print(f"URL: {auth_url}")
    
    webbrowser.open(auth_url)
    
    print("\n📝 Next steps:")
    print("1. Log in to LinkedIn and authorize the app")
    print("2. You'll be redirected to your app with a 'code' parameter")
    print("3. Copy the code from the URL")
    print("4. Use the code to get an access token")
    
    code = input("\n📥 Enter the authorization code from the URL: ").strip()
    
    if code:
        print(f"\n✅ Authorization code received: {code[:10]}...")
        print("\n🔄 To exchange this code for an access token, you'll need to:")
        print("1. Make a POST request to LinkedIn's token endpoint")
        print("2. Include the code, client_id, client_secret, and redirect_uri")
        print("\nHere's a curl command to get your access token:")
        
        curl_command = f"""
curl -X POST https://www.linkedin.com/oauth/v2/accessToken \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=authorization_code" \\
  -d "code={code}" \\
  -d "client_id={client_id}" \\
  -d "client_secret={client_secret}" \\
  -d "redirect_uri={redirect_uri}"
"""
        print(curl_command)
        print("\n📋 Copy the access_token from the response and add it to your .env file as:")
        print("LINKEDIN_ACCESS_TOKEN=<your-access-token>")
    
    print("\n🏢 To get your LinkedIn Organization ID:")
    print("1. Go to your LinkedIn company page")
    print("2. Click on 'Admin tools' → 'Manage company'")
    print("3. The organization ID is in the URL: linkedin.com/company/{org-id}/admin/")
    print("4. Add it to your .env file as:")
    print("LINKEDIN_ORGANIZATION_ID=<your-org-id>")

if __name__ == "__main__":
    setup_linkedin_oauth()