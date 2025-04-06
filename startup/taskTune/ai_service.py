import os
from typing import List, Optional
import logging
from dotenv import load_dotenv
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Set up OpenAI API key
api_key = os.getenv("OPENAI_API_KEY")

# Import OpenAI after setting up logging to handle import errors gracefully
try:
    # Try importing the newer OpenAI client
    from openai import OpenAI
    client = OpenAI(api_key=api_key)
    logger.info("Using OpenAI client v1.0+")
    OPENAI_VERSION = "new"
except (ImportError, TypeError) as e:
    # Fall back to older API if there's an issue with initialization
    logger.warning(f"Error initializing modern OpenAI client: {e}")
    try:
        # Try importing the legacy OpenAI module
        import openai
        openai.api_key = api_key
        logger.info("Using legacy OpenAI module")
        OPENAI_VERSION = "legacy"
    except ImportError:
        logger.error("Failed to import any OpenAI library")
        OPENAI_VERSION = "none"

# Maximum retries for API calls
MAX_RETRIES = 3

@retry(
    stop=stop_after_attempt(MAX_RETRIES),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type((Exception)),
    reraise=True
)
def generate_subtasks(
    task_title: str,
    task_description: str = "",
    category: str = "Task",
    priority: str = "medium",
    num_subtasks: int = 5
) -> List[str]:
    """
    Generate subtasks for a given task using OpenAI's GPT model.
    
    Args:
        task_title: The title of the task
        task_description: Optional description of the task
        category: The category of the task
        priority: The priority level of the task
        num_subtasks: Number of subtasks to generate
        
    Returns:
        A list of generated subtask titles
    """
    if not api_key or OPENAI_VERSION == "none":
        logger.warning("OpenAI API key is not set or module not available. Using fallback subtasks.")
        return generate_fallback_subtasks(task_title, category)
        
    try:
        logger.info(f"Generating subtasks for task: {task_title}")
        
        prompt = f"""
        Break down the following task into {num_subtasks} clear, actionable subtasks:
        
        Task Title: {task_title}
        Description: {task_description or "No description provided"}
        Category: {category}
        Priority: {priority}
        
        Guidelines for creating subtasks:
        1. Each subtask should be specific and actionable
        2. Each subtask should be completable in 5-30 minutes
        3. Order subtasks logically (preparation steps first, etc.)
        4. Include any necessary setup or preparation steps
        5. Include a final review/verification step if appropriate
        
        Format the response as a list of subtask titles only, one per line.
        """
        
        if OPENAI_VERSION == "new":
            # Using the new OpenAI client (1.0+)
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",  # Use a more widely available model
                messages=[
                    {"role": "system", "content": "You are a productivity assistant that helps break down tasks into manageable subtasks."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            # Extract subtasks from the response (new API format)
            subtasks_text = response.choices[0].message.content.strip()
        else:
            # Using the legacy OpenAI module (< 1.0)
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",  # Use a more widely available model
                messages=[
                    {"role": "system", "content": "You are a productivity assistant that helps break down tasks into manageable subtasks."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            # Extract subtasks from the response (legacy API format)
            subtasks_text = response.choices[0].message.content.strip()
        
        # Process the subtasks text into a list
        subtasks = [line.strip() for line in subtasks_text.split('\n') if line.strip()]
        
        # Limit to the requested number of subtasks
        return subtasks[:num_subtasks]
        
    except Exception as e:
        logger.error(f"Error generating subtasks: {str(e)}")
        # Log detailed error info for debugging
        if hasattr(e, 'response'):
            logger.error(f"API response: {e.response}")
            
        # Fallback to default subtasks if API call fails
        return generate_fallback_subtasks(task_title, category)

def generate_fallback_subtasks(task_title: str, category: str) -> List[str]:
    """Generate fallback subtasks if the OpenAI API call fails."""
    logger.info(f"Using fallback subtasks for category: {category}")
    
    # Default subtasks based on category
    if category.lower() in ["meeting", "call"]:
        return [
            "Prepare agenda",
            "Send calendar invites",
            "Prepare presentation slides",
            "Take meeting notes",
            "Send follow-up email"
        ]
    elif category.lower() in ["report", "document"]:
        return [
            "Gather necessary data",
            "Create outline",
            "Write first draft",
            "Review and edit",
            "Format document"
        ]
    elif category.lower() in ["project", "development"]:
        return [
            "Define project scope",
            "Create project timeline",
            "Assign responsibilities",
            "Implement core features",
            "Test and review"
        ]
    else:
        # Generic subtasks for any task
        return [
            "Research and plan",
            "Prepare materials",
            "Execute main task",
            "Review results",
            "Follow up if needed"
        ]

