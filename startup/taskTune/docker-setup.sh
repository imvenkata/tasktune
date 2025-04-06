#!/bin/bash

# TaskTune Docker Setup and Run Script

# Make script exit on first error
set -e

# Terminal colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}TaskTune Docker Setup${NC}"
echo "=============================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker and Docker Compose are required but not installed.${NC}"
    echo "Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check for .env file and create from template if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}No .env file found, creating from .env.docker template...${NC}"
    cp .env.docker .env
    echo -e "${GREEN}Created .env file. Please edit it to add your actual API keys.${NC}"
    echo "Edit the file now? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        ${EDITOR:-nano} .env
    fi
fi

# Check for .env.local file and create if it doesn't exist
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating .env.local file for Next.js frontend...${NC}"
    cat > .env.local << EOF
# API URL for connecting to the backend
# Use the machine's IP address so it works across the network
NEXT_PUBLIC_API_URL=http://192.168.1.38:8000

# Other Next.js settings
NEXT_PUBLIC_APP_URL=http://192.168.1.38:3000
EOF
    echo -e "${GREEN}Created .env.local file with your IP address.${NC}"
fi

# Ask which mode to run
echo ""
echo "What would you like to do?"
echo "1. Run in development mode (with live reloading)"
echo "2. Run in production mode"
echo "3. Stop containers"
echo "4. Clean up (remove containers, volumes, and images)"
read -r mode

case $mode in
    1)
        echo -e "${GREEN}Starting TaskTune in development mode...${NC}"
        docker-compose up -d
        echo -e "${GREEN}Services started!${NC}"
        echo "Backend API: http://localhost:8000"
        echo "Frontend: http://localhost:3000"
        echo ""
        echo "To view logs run: docker-compose logs -f"
        ;;
    2)
        echo -e "${GREEN}Starting TaskTune in production mode...${NC}"
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
        echo -e "${GREEN}Services started!${NC}"
        echo "Backend API: http://localhost:8000"
        echo "Frontend: http://localhost:3000"
        ;;
    3)
        echo -e "${YELLOW}Stopping TaskTune containers...${NC}"
        docker-compose down
        echo -e "${GREEN}Containers stopped.${NC}"
        ;;
    4)
        echo -e "${RED}Warning: This will remove all TaskTune containers, volumes, and images.${NC}"
        echo "Are you sure? (y/n)"
        read -r confirm
        if [[ "$confirm" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            echo -e "${YELLOW}Cleaning up TaskTune Docker resources...${NC}"
            docker-compose down -v --rmi all
            echo -e "${GREEN}Cleanup complete.${NC}"
        else
            echo "Cleanup cancelled."
        fi
        ;;
    *)
        echo -e "${RED}Invalid option selected.${NC}"
        exit 1
        ;;
esac 