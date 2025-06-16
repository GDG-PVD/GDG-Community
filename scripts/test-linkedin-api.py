#!/usr/bin/env python3
"""Test LinkedIn API connection with access token."""

import os
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_linkedin_api():
    """Test LinkedIn API with the access token."""
    access_token = os.getenv("LINKEDIN_ACCESS_TOKEN")
    organization_id = os.getenv("LINKEDIN_ORGANIZATION_ID")
    
    if not access_token:
        print("❌ LINKEDIN_ACCESS_TOKEN not found in .env file")
        return False
        
    print("🔗 Testing LinkedIn API Connection")
    print("=" * 40)
    print(f"Access Token: {access_token[:20]}...{access_token[-10:]}")
    print(f"Organization ID: {organization_id}")
    print()
    
    # Headers for API requests
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json"
    }
    
    # Test 1: Get current user profile
    print("📝 Test 1: Getting current user profile...")
    profile_url = "https://api.linkedin.com/v2/userinfo"
    
    try:
        response = requests.get(profile_url, headers=headers)
        if response.status_code == 200:
            profile_data = response.json()
            print("✅ User profile retrieved successfully!")
            print(f"   Name: {profile_data.get('name', 'N/A')}")
            print(f"   Email: {profile_data.get('email', 'N/A')}")
        else:
            print(f"❌ Failed to get profile: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error getting profile: {e}")
    
    print()
    
    # Test 2: Get member info (if basic profile access)
    print("📝 Test 2: Getting member info...")
    member_url = "https://api.linkedin.com/v2/me"
    
    try:
        # Use lite profile projection
        params = {
            "projection": "(id,firstName,lastName,vanityName)"
        }
        response = requests.get(member_url, headers=headers, params=params)
        
        if response.status_code == 200:
            member_data = response.json()
            print("✅ Member info retrieved successfully!")
            print(f"   ID: {member_data.get('id', 'N/A')}")
            
            # Handle localized names
            first_name = member_data.get('firstName', {})
            if isinstance(first_name, dict) and 'localized' in first_name:
                first_name_str = first_name['localized'].get('en_US', 'N/A')
            else:
                first_name_str = str(first_name)
                
            last_name = member_data.get('lastName', {})
            if isinstance(last_name, dict) and 'localized' in last_name:
                last_name_str = last_name['localized'].get('en_US', 'N/A')
            else:
                last_name_str = str(last_name)
                
            print(f"   Name: {first_name_str} {last_name_str}")
            print(f"   Vanity Name: {member_data.get('vanityName', 'N/A')}")
        else:
            print(f"❌ Failed to get member info: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error getting member info: {e}")
    
    print()
    
    # Test 3: Check organization access (if available)
    if organization_id:
        print("📝 Test 3: Checking organization access...")
        org_url = f"https://api.linkedin.com/v2/organizations/{organization_id}"
        
        try:
            response = requests.get(org_url, headers=headers)
            if response.status_code == 200:
                org_data = response.json()
                print("✅ Organization access confirmed!")
                print(f"   Organization: {org_data.get('localizedName', 'N/A')}")
            else:
                print(f"❌ Cannot access organization: {response.status_code}")
                print(f"   Response: {response.text}")
                print("   Note: Organization access may require additional scopes")
        except Exception as e:
            print(f"❌ Error checking organization: {e}")
    
    print()
    
    # Test 4: Check available permissions
    print("📝 Test 4: Checking available permissions...")
    print("   Note: The permissions you can use depend on the LinkedIn products enabled")
    print("   and the scopes you authorized during OAuth")
    
    # Try to check member permissions
    permissions_url = "https://api.linkedin.com/v2/me"
    try:
        response = requests.get(permissions_url, headers=headers)
        if response.status_code == 200:
            print("✅ Basic member permissions confirmed")
        
        # Check if we can access share API
        test_headers = headers.copy()
        test_headers["Content-Type"] = "application/json"
        
        # This is just a dry run to see if we have share permissions
        share_test = {
            "author": f"urn:li:person:{member_data.get('id', 'unknown')}",
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {
                        "text": "Test post - checking permissions"
                    },
                    "shareMediaCategory": "NONE"
                }
            },
            "visibility": {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
            }
        }
        
        # We won't actually post, just check if the endpoint is accessible
        share_url = "https://api.linkedin.com/v2/ugcPosts"
        response = requests.options(share_url, headers=test_headers)
        
        if response.status_code in [200, 204]:
            print("✅ Share/posting permissions appear to be available")
        else:
            print("⚠️  Share/posting permissions may be limited")
            
    except Exception as e:
        print(f"❌ Error checking permissions: {e}")
    
    print("\n✅ LinkedIn API test completed!")
    return True

if __name__ == "__main__":
    test_linkedin_api()