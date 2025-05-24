"""Base agent class implementing Google ADK best practices."""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import logging
from .adk_compat import BaseAgent as ADKBaseAgent, Tool, AgentResponse

logger = logging.getLogger(__name__)


@dataclass
class AgentConfig:
    """Configuration for agents."""
    name: str
    description: str
    model: str = "gemini-1.5-flash"
    temperature: float = 0.7
    max_tokens: int = 2048


class BaseAgent(ADKBaseAgent):
    """
    Base class for all agents following Google ADK best practices.
    
    This class provides:
    - Consistent initialization
    - Tool management
    - Error handling
    - Logging
    - Session management
    """
    
    def __init__(self, config: AgentConfig):
        """Initialize the agent with configuration."""
        super().__init__(
            name=config.name,
            description=config.description,
            model_config={
                "model": config.model,
                "temperature": config.temperature,
                "max_tokens": config.max_tokens
            }
        )
        self.config = config
        self.tools: List[Tool] = []
        self._setup_tools()
        
    def _setup_tools(self):
        """Override this method to register agent-specific tools."""
        pass
        
    def register_tool(self, tool: Tool):
        """Register a tool for this agent."""
        self.tools.append(tool)
        logger.info(f"Registered tool '{tool.name}' for agent '{self.config.name}'")
        
    async def process(self, input_data: Dict[str, Any]) -> AgentResponse:
        """
        Process input and return a response.
        
        Override this method in subclasses to implement agent logic.
        """
        raise NotImplementedError("Subclasses must implement process()")
        
    def get_tools(self) -> List[Tool]:
        """Get all registered tools for this agent."""
        return self.tools
        
    def get_system_prompt(self) -> str:
        """
        Get the system prompt for this agent.
        
        Override this method to provide custom system prompts.
        """
        return f"You are {self.config.name}. {self.config.description}"
