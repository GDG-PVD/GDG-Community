#!/usr/bin/env python3
"""LinkedIn OAuth setup based on available products."""

import os
from urllib.parse import urlencode
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def generate_linkedin_oauth_url(product_type="basic"):
    """Generate LinkedIn OAuth URL based on enabled products."""
    client_id = os.getenv("LINKEDIN_CLIENT_ID")
    
    if not client_id:
        print("❌ LinkedIn CLIENT_ID not found in .env file")
        return
    
    redirect_uri = "https://XXX.web.app/oauth/linkedin/callback"
    
    # Different scope sets based on enabled products
    scope_sets = {
        "basic": [
            "openid",              # OpenID Connect
            "profile",             # Basic profile info
            "email",               # Email address
            "w_member_social"      # Post on member's behalf
        ],
        "community": [
            "openid",
            "profile", 
            "email",
            "w_member_social",
            "w_organization_social",  # Post for organizations
            "r_organization_social",  # Read organization data
            "rw_organization_admin"   # Manage organization
        ],
        "full": [
            "openid",
            "profile",
            "email",
            "w_member_social",
            "w_organization_social",
            "r_organization_social",
            "rw_organization_admin",
            "r_events",              # Read events
            "w_events"               # Write events
        ]
    }
    
    scopes = scope_sets.get(product_type, scope_sets["basic"])
    
    # Build authorization URL
    auth_params = {
        "response_type": "code",
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "scope": " ".join(scopes),
        "state": "XXX"
    }
    
    auth_url = f"https://www.linkedin.com/oauth/v2/authorization?{urlencode(auth_params)}"
    
    print(f"🔗 LinkedIn OAuth Setup - {product_type.upper()} Configuration")
    print("=" * 60)
    print(f"Client ID: {client_id}")
    print(f"Redirect URI: {redirect_uri}")
    print(f"\nScopes for {product_type} access:")
    for scope in scopes:
        print(f"  - {scope}")
    
    print(f"\n🌐 Authorization URL ({product_type}):")
    print(f"\n{auth_url}")
    
    print("\n📋 Exchange code for token:")
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
    
    print("\n💡 Product-specific notes:")
    if product_type == "basic":
        print("- This gives you basic sharing capabilities")
        print("- You can post on member profiles")
        print("- Limited organization features")
    elif product_type == "community":
        print("- Full community management capabilities")
        print("- Post on behalf of organizations")
        print("- Manage organization presence")
    elif product_type == "full":
        print("- All community features plus events")
        print("- Create and manage LinkedIn events")
        print("- Full organization management")

if __name__ == "__main__":
    print("Choose your LinkedIn product configuration:\n")
    print("1. Basic (Share on LinkedIn only)")
    print("2. Community (With Community Management API)")
    print("3. Full (Community + Events Management)")
    
    # Default to basic for now
    print("\n🚀 Generating URLs for all configurations...\n")
    
    for config in ["basic", "community", "full"]:
        generate_linkedin_oauth_url(config)
        print("\n" + "="*60 + "\n")