#!/usr/bin/env python3
"""Simple test of Pinecone connection."""

import os
from dotenv import load_dotenv
from pinecone import Pinecone

# Load environment variables
load_dotenv()

def test_pinecone():
    """Test basic Pinecone connection."""
    api_key = os.getenv("PINECONE_API_KEY")
    
    if not api_key:
        print("❌ PINECONE_API_KEY not found in environment variables")
        return False
    
    print(f"🔑 API Key found: {api_key[:8]}...{api_key[-4:]}")
    
    try:
        # Initialize Pinecone with just the API key
        pc = Pinecone(api_key=api_key)
        
        # List existing indexes
        indexes = pc.list_indexes()
        print("\n📚 Existing indexes:")
        for index in indexes:
            print(f"  - {index.name}")
            print(f"    Host: {index.host}")
            print(f"    Dimension: {index.dimension}")
            print(f"    Metric: {index.metric}")
            print(f"    Status: {index.status}")
            print()
        
        # Try to connect to the existing gdg-community index
        if 'gdg-community' in [idx.name for idx in indexes]:
            print("🔗 Connecting to 'gdg-community' index...")
            index = pc.Index('gdg-community')
            
            # Get index stats
            stats = index.describe_index_stats()
            print(f"\n📊 Index stats for 'gdg-community':")
            print(f"  - Total vectors: {stats.get('total_vector_count', 0)}")
            print(f"  - Dimension: {stats.get('dimension', 'N/A')}")
            print(f"  - Namespaces: {stats.get('namespaces', {})}")
            
            print("\n✅ Successfully connected to existing index!")
            return True
        else:
            print("\n⚠️  'gdg-community' index not found, but connection is working!")
            return True
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing Pinecone connection...")
    success = test_pinecone()
    
    if not success:
        print("\n❌ Pinecone connection failed")
        print("\nPlease check:")
        print("1. Your API key is correct")
        print("2. Your Pinecone account is active")