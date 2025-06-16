#!/usr/bin/env python3
"""Test Pinecone connection with proper configuration."""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

from pinecone import Pinecone, ServerlessSpec

def test_pinecone_connection():
    """Test Pinecone connection and create index if needed."""
    api_key = os.getenv("PINECONE_API_KEY")
    environment = os.getenv("PINECONE_ENVIRONMENT")
    
    if not api_key:
        print("❌ PINECONE_API_KEY not found in environment variables")
        return False
    
    print(f"🔑 API Key found: {api_key[:8]}...{api_key[-4:]}")
    
    # Try to parse the host/environment
    if environment and ".svc." in environment:
        # This looks like a full host URL, extract the region
        parts = environment.split(".")
        region = parts[-2] + "-" + parts[-1].replace("pinecone", "").replace("io", "")
        print(f"🌍 Full URL provided, extracted region: {region}")
    else:
        region = environment
        print(f"🌍 Environment/Region: {region}")
    
    try:
        # Initialize Pinecone with API key only (no environment needed)
        pc = Pinecone(api_key=api_key)
        
        # List existing indexes
        indexes = pc.list_indexes()
        print("\n📚 Existing indexes:")
        for index in indexes:
            print(f"  - {index.name}")
        
        # Check if our index exists
        index_name = "gdg-companion"
        existing_index_names = [index.name for index in indexes]
        
        if index_name in existing_index_names:
            print(f"✅ Index '{index_name}' already exists")
            # Connect to the existing index
            index = pc.Index(index_name)
        else:
            print(f"\n🔨 Creating index '{index_name}'...")
            
            # For serverless indexes, we need to specify the cloud provider
            spec = ServerlessSpec(
                cloud='aws',
                region=region if region else 'us-east-1'  # Default to us-east-1
            )
            
            pc.create_index(
                name=index_name,
                dimension=768,  # Gemini embedding dimension
                metric="cosine",
                spec=spec
            )
            print(f"✅ Index '{index_name}' created successfully!")
            index = pc.Index(index_name)
        
        # Get index stats
        stats = index.describe_index_stats()
        print(f"\n📊 Index stats:")
        print(f"  - Total vectors: {stats.get('total_vector_count', 0)}")
        print(f"  - Dimension: {stats.get('dimension', 'N/A')}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error connecting to Pinecone: {e}")
        print("\nPossible issues:")
        print("1. Check if your API key is correct")
        print("2. Your Pinecone index might already exist with the name 'gdg-community'")
        print("3. Check your Pinecone dashboard at https://app.pinecone.io")
        return False

if __name__ == "__main__":
    print("🚀 Testing Pinecone connection...")
    success = test_pinecone_connection()
    
    if success:
        print("\n✅ Pinecone connection successful!")
    else:
        print("\n❌ Pinecone connection failed")
        print("\nNext steps:")
        print("1. Check your Pinecone dashboard at https://app.pinecone.io")
        print("2. Look for the correct region in your dashboard (e.g., 'us-east-1', 'gcp-starter')")
        print("3. Update the .env file with the correct region")