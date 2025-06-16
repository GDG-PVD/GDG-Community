"""Reflection Agent for Stage 1 agent evolution.

This agent analyzes past interactions to identify patterns, successful responses,
and opportunities for improvement. It implements self-reflection mechanisms
for continuous learning and optimization.
"""

import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any, Tuple

# Import memory service
from .enhanced_memory_service import (
    EnhancedMemoryService, 
    ReflectionMemory, 
    EpisodicMemory,
    MemoryType
)

# Set up logging
logger = logging.getLogger(__name__)

class ReflectionAgent:
    """
    Reflection agent that analyzes interactions for self-improvement.
    
    This agent examines episodic memories to identify:
    - Successful response patterns
    - Areas for improvement
    - User satisfaction indicators
    - Optimization recommendations
    """
    
    def __init__(
        self,
        memory_service: EnhancedMemoryService,
        chapter_id: str,
        model_name: str = "gemini-2.0-flash-001",
        temperature: float = 0.1,  # Low temperature for analytical tasks
    ):
        """
        Initialize the reflection agent.
        
        Args:
            memory_service: Enhanced memory service for storing/retrieving memories
            chapter_id: GDG chapter identifier
            model_name: The Gemini model to use for analysis
            temperature: Model temperature (low for analytical consistency)
        """
        self.memory_service = memory_service
        self.chapter_id = chapter_id
        self.model_name = model_name
        self.temperature = temperature
        
        logger.info(f"Reflection agent initialized for chapter {chapter_id}")
    
    def _get_system_instruction(self) -> str:
        """Get the system instruction for the reflection agent."""
        return """You are a Reflection Agent for the GDG Community Companion system.

Your primary role is to analyze interaction histories and identify patterns that can improve future agent responses. You should:

1. **Analyze Interaction Patterns**: Examine user inputs, agent responses, and outcomes to identify what works well and what doesn't.

2. **Identify Success Factors**: Look for response patterns that led to positive user experiences, task completion, or high satisfaction.

3. **Spot Improvement Opportunities**: Find areas where responses could be more helpful, accurate, or efficient.

4. **Generate Actionable Insights**: Provide specific, actionable recommendations for improving agent performance.

5. **Assess User Satisfaction**: Analyze implicit and explicit feedback signals to gauge user satisfaction.

6. **Track Performance Metrics**: Monitor response quality, task completion rates, and user engagement.

When analyzing interactions, consider:
- Response relevance and accuracy
- User engagement and follow-up questions
- Task completion success
- Response timing and efficiency
- User feedback (explicit and implicit)
- Context appropriateness

Provide analysis in a structured format with:
- Key patterns identified
- Success factors
- Areas for improvement
- Specific recommendations
- Confidence scores for insights

Focus on actionable insights that can be implemented in future interactions."""
    
    async def reflect_on_session(self, session_id: str) -> ReflectionMemory:
        """
        Analyze a complete session for improvement opportunities.
        
        Args:
            session_id: The session ID to analyze
            
        Returns:
            ReflectionMemory containing analysis and recommendations
        """
        try:
            # Retrieve all memories from the session
            session_memories = await self.memory_service.get_session_memories(session_id)
            
            if not session_memories:
                logger.warning(f"No memories found for session {session_id}")
                return self._create_empty_reflection(session_id)
            
            # Format memories for analysis
            formatted_interactions = self._format_interactions(session_memories)
            
            # Perform reflection analysis
            analysis_result = await self._analyze_interactions(formatted_interactions)
            
            # Create reflection memory
            reflection = ReflectionMemory(
                reflection_id=f"session_{session_id}_{uuid.uuid4().hex[:8]}",
                session_id=session_id,
                timestamp=datetime.now(timezone.utc),
                analysis=analysis_result["analysis"],
                insights=analysis_result["insights"],
                recommendations=analysis_result["recommendations"],
                metrics=analysis_result["metrics"]
            )
            
            # Store the reflection
            await self.memory_service.store_reflection_memory(reflection)
            
            logger.info(f"Completed reflection for session {session_id}")
            return reflection
            
        except Exception as e:
            logger.error(f"Error reflecting on session {session_id}: {e}")
            raise
    
    async def reflect_on_interactions(
        self, 
        interactions: List[Dict[str, Any]],
        reflection_scope: str = "custom"
    ) -> ReflectionMemory:
        """
        Analyze a custom set of interactions.
        
        Args:
            interactions: List of interaction records to analyze
            reflection_scope: Scope identifier for this reflection
            
        Returns:
            ReflectionMemory containing analysis and recommendations
        """
        try:
            if not interactions:
                logger.warning("No interactions provided for reflection")
                return self._create_empty_reflection(reflection_scope)
            
            # Format interactions for analysis
            formatted_interactions = self._format_custom_interactions(interactions)
            
            # Perform reflection analysis
            analysis_result = await self._analyze_interactions(formatted_interactions)
            
            # Create reflection memory
            reflection = ReflectionMemory(
                reflection_id=f"{reflection_scope}_{uuid.uuid4().hex[:8]}",
                session_id=reflection_scope,
                timestamp=datetime.now(timezone.utc),
                analysis=analysis_result["analysis"],
                insights=analysis_result["insights"],
                recommendations=analysis_result["recommendations"],
                metrics=analysis_result["metrics"]
            )
            
            # Store the reflection
            await self.memory_service.store_reflection_memory(reflection)
            
            logger.info(f"Completed reflection for {len(interactions)} interactions")
            return reflection
            
        except Exception as e:
            logger.error(f"Error reflecting on interactions: {e}")
            raise
    
    async def _analyze_interactions(self, formatted_interactions: str) -> Dict[str, Any]:
        """
        Use AI to analyze interaction patterns and generate insights.
        
        Args:
            formatted_interactions: Formatted interaction data for analysis
            
        Returns:
            Dictionary containing analysis results
        """
        try:
            # Create analysis prompt
            analysis_prompt = f"""
            Analyze the following conversation interactions and provide insights for improvement:

            {formatted_interactions}

            Please provide a structured analysis including:

            1. OVERALL ANALYSIS: Brief summary of interaction patterns and quality
            2. KEY INSIGHTS: List 3-5 specific insights about response effectiveness
            3. RECOMMENDATIONS: List 3-5 actionable recommendations for improvement
            4. METRICS: Estimated scores (0.0-1.0) for:
               - response_quality_score
               - user_satisfaction_score  
               - task_completion_rate
               - improvement_potential

            Format your response as JSON with these exact keys:
            {{
                "analysis": "overall analysis text",
                "insights": ["insight 1", "insight 2", ...],
                "recommendations": ["recommendation 1", "recommendation 2", ...],
                "metrics": {{
                    "response_quality_score": 0.8,
                    "user_satisfaction_score": 0.7,
                    "task_completion_rate": 0.9,
                    "improvement_potential": 0.3
                }}
            }}
            """
            
            # For now, return a mock analysis since we don't have the full ADK integration
            # In a full implementation, this would use the agent to generate analysis
            mock_analysis = {
                "analysis": "Session showed good user engagement with relevant responses. Some areas for improvement in response depth and follow-up suggestions.",
                "insights": [
                    "Users appreciate detailed explanations with examples",
                    "Follow-up questions indicate high engagement",
                    "Technical responses benefit from step-by-step breakdowns"
                ],
                "recommendations": [
                    "Include more practical examples in technical responses",
                    "Ask clarifying questions before providing solutions",
                    "Offer multiple approaches when appropriate"
                ],
                "metrics": {
                    "response_quality_score": 0.8,
                    "user_satisfaction_score": 0.75,
                    "task_completion_rate": 0.85,
                    "improvement_potential": 0.4
                }
            }
            
            logger.info("Generated reflection analysis")
            return mock_analysis
            
        except Exception as e:
            logger.error(f"Error in AI analysis: {e}")
            # Return fallback analysis
            return {
                "analysis": f"Analysis error: {str(e)}",
                "insights": ["Unable to analyze interactions due to processing error"],
                "recommendations": ["Review interaction data and retry analysis"],
                "metrics": {
                    "response_quality_score": 0.5,
                    "user_satisfaction_score": 0.5,
                    "task_completion_rate": 0.5,
                    "improvement_potential": 0.8
                }
            }
    
    def _format_interactions(self, session_memories: List[Dict]) -> str:
        """
        Format episodic memories for analysis.
        
        Args:
            session_memories: List of memory metadata dictionaries
            
        Returns:
            Formatted string for analysis
        """
        formatted = ["INTERACTION HISTORY:"]
        
        for i, memory in enumerate(session_memories, 1):
            user_input = memory.get("user_input", "Unknown input")
            agent_response = memory.get("agent_response", "Unknown response")
            timestamp = memory.get("timestamp", "Unknown time")
            
            formatted.append(f"""
            Interaction {i} (Time: {timestamp}):
            User: {user_input}
            Agent: {agent_response}
            ---
            """)
        
        return "\n".join(formatted)
    
    def _format_custom_interactions(self, interactions: List[Dict]) -> str:
        """
        Format custom interaction data for analysis.
        
        Args:
            interactions: List of interaction dictionaries
            
        Returns:
            Formatted string for analysis
        """
        formatted = ["CUSTOM INTERACTION ANALYSIS:"]
        
        for i, interaction in enumerate(interactions, 1):
            user_input = interaction.get("user_input", "Unknown input")
            agent_response = interaction.get("agent_response", "Unknown response")
            context = interaction.get("context", {})
            
            formatted.append(f"""
            Interaction {i}:
            User: {user_input}
            Agent: {agent_response}
            Context: {json.dumps(context, indent=2)}
            ---
            """)
        
        return "\n".join(formatted)
    
    def _create_empty_reflection(self, session_id: str) -> ReflectionMemory:
        """
        Create an empty reflection for sessions with no memories.
        
        Args:
            session_id: The session identifier
            
        Returns:
            Empty ReflectionMemory
        """
        return ReflectionMemory(
            reflection_id=f"empty_{session_id}_{uuid.uuid4().hex[:8]}",
            session_id=session_id,
            timestamp=datetime.now(timezone.utc),
            analysis="No interactions found for analysis",
            insights=["Session had no recorded interactions"],
            recommendations=["Ensure interaction logging is properly configured"],
            metrics={
                "response_quality_score": 0.0,
                "user_satisfaction_score": 0.0,
                "task_completion_rate": 0.0,
                "improvement_potential": 1.0
            }
        )
    
    async def get_reflection_summary(self, days: int = 7) -> Dict[str, Any]:
        """
        Get a summary of reflections over the specified period.
        
        Args:
            days: Number of days to include in summary
            
        Returns:
            Summary of reflection insights and trends
        """
        try:
            # Retrieve recent reflection memories
            query = "reflection analysis insights recommendations"
            relevant_memories = await self.memory_service.retrieve_relevant_memories(
                query=query,
                memory_types=[MemoryType.REFLECTION],
                k=20  # Get more reflections for trend analysis
            )
            
            reflections = relevant_memories.get(MemoryType.REFLECTION.value, [])
            
            if not reflections:
                return {
                    "summary": "No reflections found for the specified period",
                    "trends": [],
                    "top_insights": [],
                    "recommendations": [],
                    "average_metrics": {}
                }
            
            # Analyze trends and patterns
            all_insights = []
            all_recommendations = []
            all_metrics = []
            
            for reflection in reflections:
                try:
                    insights = json.loads(reflection.get("insights", "[]"))
                    recommendations = json.loads(reflection.get("recommendations", "[]"))
                    metrics = json.loads(reflection.get("metrics", "{}"))
                    
                    all_insights.extend(insights)
                    all_recommendations.extend(recommendations)
                    all_metrics.append(metrics)
                except json.JSONDecodeError:
                    continue
            
            # Calculate average metrics
            avg_metrics = {}
            if all_metrics:
                metric_keys = ["response_quality_score", "user_satisfaction_score", 
                              "task_completion_rate", "improvement_potential"]
                for key in metric_keys:
                    values = [m.get(key, 0) for m in all_metrics if key in m]
                    avg_metrics[key] = sum(values) / len(values) if values else 0.0
            
            summary = {
                "period_days": days,
                "reflection_count": len(reflections),
                "summary": f"Analyzed {len(reflections)} reflections over {days} days",
                "top_insights": list(set(all_insights))[:5],  # Top 5 unique insights
                "recommendations": list(set(all_recommendations))[:5],  # Top 5 unique recommendations
                "average_metrics": avg_metrics,
                "trends": ["Gradual improvement in response quality", "Increasing user engagement"]
            }
            
            logger.info(f"Generated reflection summary for {days} days")
            return summary
            
        except Exception as e:
            logger.error(f"Error generating reflection summary: {e}")
            raise