import os
import openai
from typing import List
from dotenv import load_dotenv

load_dotenv()

# Set up OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

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
    try:
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
        
        response = openai.ChatCompletion.create(
            model="gpt-4o",  # or "gpt-3.5-turbo" for a more cost-effective option
            messages=[
                {"role": "system", "content": "You are a productivity assistant that helps break down tasks into manageable subtasks."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        # Extract subtasks from the response
        subtasks_text = response.choices[0].message.content.strip()
        subtasks = [line.strip() for line in subtasks_text.split('\n') if line.strip()]
        
        # Limit to the requested number of subtasks
        return subtasks[:num_subtasks]
        
    except Exception as e:
        print(f"Error generating subtasks: {e}")
        # Fallback to default subtasks if API call fails
        return generate_fallback_subtasks(task_title, category)

def generate_fallback_subtasks(task_title: str, category: str) -> List[str]:
    """Generate fallback subtasks if the OpenAI API call fails."""
    
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

