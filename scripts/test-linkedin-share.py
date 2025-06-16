#!/usr/bin/env python3
"""Test LinkedIn sharing capabilities with current permissions."""

import os
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_linkedin_share():
    """Test what LinkedIn sharing capabilities we have."""
    access_token = os.getenv("LINKEDIN_ACCESS_TOKEN")
    
    if not access_token:
        print("❌ LINKEDIN_ACCESS_TOKEN not found in .env file")
        return False
        
    print("🔗 Testing LinkedIn Sharing Capabilities")
    print("=" * 40)
    print(f"Access Token: {access_token[:20]}...{access_token[-10:]}")
    print()
    
    # Headers for API requests
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json"
    }
    
    # Test 1: Get current user info using userinfo endpoint (OpenID Connect)
    print("📝 Test 1: Getting current user info...")
    userinfo_url = "https://api.linkedin.com/v2/userinfo"
    
    try:
        response = requests.get(userinfo_url, headers=headers)
        if response.status_code == 200:
            user_data = response.json()
            print("✅ User info retrieved successfully!")
            print(f"   Name: {user_data.get('name', 'N/A')}")
            print(f"   Email: {user_data.get('email', 'N/A')}")
            print(f"   Subject (ID): {user_data.get('sub', 'N/A')}")
            user_id = user_data.get('sub')
        else:
            print(f"❌ Failed to get user info: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error getting user info: {e}")
        return False
    
    print()
    
    # Test 2: Check if we can prepare a share (without actually posting)
    print("📝 Test 2: Testing share capability...")
    
    # Create a test post structure
    test_post = {
        "author": f"urn:li:person:{user_id}",
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {
                    "text": "This is a test post from GDG Community Companion"
                },
                "shareMediaCategory": "NONE"
            }
        },
        "visibility": {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
    }
    
    print("✅ Post structure created successfully")
    print("   Note: This is a dry run - no actual post will be created")
    print()
    
    # Test 3: Check share API endpoint accessibility
    print("📝 Test 3: Checking share API endpoint...")
    share_url = "https://api.linkedin.com/v2/ugcPosts"
    
    try:
        # Use HEAD request to check if endpoint is accessible
        response = requests.head(share_url, headers=headers)
        if response.status_code in [200, 405]:  # 405 means method not allowed, but endpoint exists
            print("✅ Share API endpoint is accessible")
            print("   You should be able to create posts with w_member_social scope")
        else:
            print(f"⚠️  Share API endpoint returned: {response.status_code}")
            print("   You may need additional permissions")
    except Exception as e:
        print(f"❌ Error checking share endpoint: {e}")
    
    print()
    
    # Summary
    print("📊 Summary:")
    print("✅ Basic authentication is working")
    print("✅ User profile access confirmed")
    
    if user_id:
        print(f"✅ User ID for posting: {user_id}")
        print("\n🚀 Next Steps:")
        print("1. You can now implement posting functionality")
        print("2. Posts will be created on behalf of your personal profile")
        print("3. For organization posting, you'll need the Community Management API")
    
    return True

if __name__ == "__main__":
    test_linkedin_share()