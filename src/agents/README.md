# GDG Community Companion - Agent System

This directory contains the implementation of the multi-agent system using Google's Agent Development Kit (ADK).

## Agent Structure

- `core_agent.py`: Core orchestrator agent that coordinates all other agents
- `content_agent.py`: Specialized agent for content generation
- `analytics_agent.py`: Specialized agent for metrics analysis and learning
- `planning_agent.py`: Specialized agent for scheduling and coordination
- `knowledge_agent.py`: Specialized agent for knowledge management

## Usage

To use the agent system, import the `CommunityCompanion` class from `__init__.py`:

```python
from gdg_community.agents import CommunityCompanion

companion = CommunityCompanion(chapter_id="gdg-providence")
response = companion.process("Generate a Twitter post for our upcoming Flutter workshop")
```

## Extension

To add new specialized agents, follow these steps:

1. Create a new Python file for your agent (e.g., `my_agent.py`)
2. Implement the required agent interface
3. Register your agent in `__init__.py`
4. Update the core agent to handle routing to your new agent
