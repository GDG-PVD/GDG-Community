#!/usr/bin/env python3
"""Test all external service connections."""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

# Load environment variables
load_dotenv()

def test_pinecone():
    """Test Pinecone connection."""
    print("\n🔍 Testing Pinecone Connection...")
    try:
        from pinecone import Pinecone
        
        api_key = os.getenv("PINECONE_API_KEY")
        host = os.getenv("PINECONE_HOST")
        
        if not api_key:
            print("❌ PINECONE_API_KEY not found")
            return False
            
        print(f"  API Key: {api_key[:8]}...{api_key[-4:]}")
        print(f"  Host: {host}")
        
        # Initialize Pinecone
        pc = Pinecone(api_key=api_key)
        
        # List indexes
        indexes = pc.list_indexes()
        print(f"  Indexes found: {len(list(indexes))}")
        
        # Try to connect to gdg-community index
        if 'gdg-community' in [idx.name for idx in indexes]:
            index = pc.Index('gdg-community')
            stats = index.describe_index_stats()
            print(f"  Connected to 'gdg-community' index")
            print(f"  Dimension: {stats.get('dimension', 'N/A')}")
            print(f"  Total vectors: {stats.get('total_vector_count', 0)}")
            print("✅ Pinecone connection successful!")
            return True
        else:
            print("⚠️  'gdg-community' index not found")
            return False
            
    except Exception as e:
        print(f"❌ Pinecone error: {e}")
        return False

def test_firebase():
    """Test Firebase connection."""
    print("\n🔍 Testing Firebase Connection...")
    try:
        project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
        print(f"  Project ID: {project_id}")
        
        if project_id == "gdg-community-companion":
            print("✅ Firebase project configured correctly!")
            return True
        else:
            print("❌ Firebase project ID mismatch")
            return False
            
    except Exception as e:
        print(f"❌ Firebase error: {e}")
        return False

def test_linkedin():
    """Test LinkedIn configuration."""
    print("\n🔍 Testing LinkedIn Configuration...")
    try:
        client_id = os.getenv("LINKEDIN_CLIENT_ID")
        client_secret = os.getenv("LINKEDIN_CLIENT_SECRET")
        access_token = os.getenv("LINKEDIN_ACCESS_TOKEN")
        
        print(f"  Client ID: {client_id}")
        print(f"  Client Secret: {'***' if client_secret else 'Not found'}")
        print(f"  Access Token: {'Set' if access_token else 'Not set (OAuth required)'}")
        
        if client_id and client_secret:
            print("✅ LinkedIn credentials configured!")
            if not access_token:
                print("⚠️  Still need to complete OAuth flow for access token")
            return True
        else:
            print("❌ LinkedIn credentials missing")
            return False
            
    except Exception as e:
        print(f"❌ LinkedIn error: {e}")
        return False

def test_bluesky():
    """Test Bluesky configuration."""
    print("\n🔍 Testing Bluesky Configuration...")
    try:
        identifier = os.getenv("BLUESKY_IDENTIFIER")
        app_password = os.getenv("BLUESKY_APP_PASSWORD")
        
        print(f"  Identifier: {identifier or 'Not set'}")
        print(f"  App Password: {'Set' if app_password else 'Not set'}")
        
        if identifier and app_password:
            print("✅ Bluesky credentials configured!")
            return True
        else:
            print("⚠️  Bluesky credentials not configured (optional)")
            return False
            
    except Exception as e:
        print(f"❌ Bluesky error: {e}")
        return False

def test_vector_store():
    """Test the VectorStore implementation."""
    print("\n🔍 Testing VectorStore Implementation...")
    try:
        from src.knowledge.vector_store import VectorStore
        
        # Initialize vector store
        vs = VectorStore()
        vs.initialize()
        
        print("✅ VectorStore initialized successfully!")
        return True
        
    except Exception as e:
        print(f"❌ VectorStore error: {e}")
        return False

def main():
    """Run all tests."""
    print("🚀 Testing All Connections")
    print("=" * 50)
    
    results = {
        "Pinecone": test_pinecone(),
        "Firebase": test_firebase(),
        "LinkedIn": test_linkedin(),
        "Bluesky": test_bluesky(),
        "VectorStore": test_vector_store()
    }
    
    print("\n📊 Test Summary")
    print("=" * 50)
    for service, status in results.items():
        icon = "✅" if status else ("⚠️" if service in ["Bluesky"] else "❌")
        print(f"{icon} {service}: {'Connected' if status else 'Not connected'}")
    
    print("\n🔄 Next Steps:")
    if not results["LinkedIn"]:
        print("1. Complete LinkedIn OAuth flow to get access token")
    if not results["Bluesky"]:
        print("2. (Optional) Set up Bluesky credentials")
    
    print("\n📝 Deployment Commands:")
    print("1. Deploy Firebase services:")
    print("   firebase deploy --only functions,firestore:rules,storage:rules")
    print("2. Create admin user:")
    print("   node scripts/create-admin-user.js")
    print("3. Test the live app:")
    print("   https://gdg-community-companion.web.app")

if __name__ == "__main__":
    main()