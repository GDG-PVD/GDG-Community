#!/usr/bin/env python3
"""Test Pinecone connection and create index if needed."""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

import pinecone
from pinecone import Pinecone, ServerlessSpec

def test_pinecone_connection():
    """Test Pinecone connection and create index if needed."""
    api_key = os.getenv("PINECONE_API_KEY")
    environment = os.getenv("PINECONE_ENVIRONMENT")
    
    if not api_key:
        print("❌ PINECONE_API_KEY not found in environment variables")
        return False
    
    print(f"🔑 API Key found: {api_key[:8]}...{api_key[-4:]}")
    print(f"🌍 Environment: {environment}")
    
    try:
        # Initialize Pinecone with new client
        pc = Pinecone(api_key=api_key)
        
        # List existing indexes
        indexes = pc.list_indexes()
        print("\n📚 Existing indexes:")
        for index in indexes:
            print(f"  - {index.name}")
        
        # Check if our index exists
        index_name = "gdg-companion"
        if index_name not in [index.name for index in indexes]:
            print(f"\n🔨 Creating index '{index_name}'...")
            pc.create_index(
                name=index_name,
                dimension=768,  # Gemini embedding dimension
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="aws",
                    region=environment
                )
            )
            print(f"✅ Index '{index_name}' created successfully!")
        else:
            print(f"✅ Index '{index_name}' already exists")
        
        # Connect to the index
        index = pc.Index(index_name)
        stats = index.describe_index_stats()
        print(f"\n📊 Index stats:")
        print(f"  - Total vectors: {stats['total_vector_count']}")
        print(f"  - Dimension: {stats['dimension']}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error connecting to Pinecone: {e}")
        print("\nPossible issues:")
        print("1. Check if your API key is correct")
        print("2. Verify the environment/region setting")
        print("3. Make sure your Pinecone account is active")
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
        print("2. Verify your API key and environment settings")
        print("3. Update the .env file with correct values")