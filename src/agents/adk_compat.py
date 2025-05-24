"""Compatibility layer for Google ADK to match our implementation."""

from google.adk import Agent as ADKAgent
from google.adk.tools import FunctionTool
from google.adk.sessions import Session as ADKSession

# Create compatibility classes
class Session:
    """Compatibility wrapper for ADK Session."""
    def __init__(self):
        self.turns = []
        # ADK Session requires specific parameters
        import uuid
        self._adk_session = ADKSession(
            id=str(uuid.uuid4()),
            app_name="gdg-community-companion",
            user_id="system"
        )
    
    def add_turn(self, turn):
        """Add a conversation turn."""
        self.turns.append(turn)

class ConversationTurn:
    """Simple conversation turn implementation."""
    def __init__(self, user_input=None, assistant_response=None):
        self.user_input = user_input
        self.assistant_response = assistant_response

class ModelConfig:
    """Simple model configuration."""
    def __init__(self, temperature=0.7, top_p=0.95, max_output_tokens=1024, candidate_count=1):
        self.temperature = temperature
        self.top_p = top_p
        self.max_output_tokens = max_output_tokens
        self.candidate_count = candidate_count

class SafetySettings:
    """Simple safety settings."""
    def __init__(self, harassment="BLOCK_NONE", hate_speech="BLOCK_NONE", 
                 sexually_explicit="BLOCK_NONE", dangerous_content="BLOCK_NONE"):
        self.harassment = harassment
        self.hate_speech = hate_speech
        self.sexually_explicit = sexually_explicit
        self.dangerous_content = dangerous_content

class Tool:
    """Compatibility wrapper for ADK FunctionTool."""
    def __init__(self, name, description, function, parameters=None):
        self.name = name
        self.description = description
        self.function = function
        self.parameters = parameters or {}
        
        # Create the actual ADK FunctionTool
        # FunctionTool only takes the function as parameter
        self._adk_tool = FunctionTool(func=function)
        # Set name and description as attributes if supported
        if hasattr(self._adk_tool, 'name'):
            self._adk_tool.name = name
        if hasattr(self._adk_tool, 'description'):
            self._adk_tool.description = description

class Agent:
    """Compatibility wrapper for ADK Agent with our enhancements."""
    def __init__(self, name, model, description, instruction="", tools=None, 
                 model_config=None, safety_settings=None, sub_agents=None, **kwargs):
        # Store our additional attributes
        self.model_config = model_config
        self.safety_settings = safety_settings
        self.name = name
        self.model = model
        self.description = description
        self.instruction = instruction
        
        # Convert our Tool objects to ADK FunctionTools
        adk_tools = []
        self.tools = tools or []
        if tools:
            for tool in tools:
                if hasattr(tool, '_adk_tool'):
                    adk_tools.append(tool._adk_tool)
                else:
                    adk_tools.append(tool)
        
        # Create the actual ADK Agent
        self._adk_agent = ADKAgent(
            name=name,
            model=model,
            description=description,
            instruction=instruction,
            tools=adk_tools,
            sub_agents=sub_agents or [],
            **kwargs
        )
        
        # Expose some properties from the ADK agent
        self.sub_agents = self._adk_agent.sub_agents
    
    async def generate_content(self, prompt, session=None, stream=False):
        """Generate content with compatibility layer."""
        # For now, return a mock response
        class MockResponse:
            def __init__(self, text):
                self.text = text
        
        # In a real implementation, this would call the actual ADK method
        return MockResponse(f"Response to: {prompt[:50]}...")