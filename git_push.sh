#!/bin/bash

# Check if a commit message is provided as an argument
if [ $# -eq 0 ]; then
    echo "Usage: $0 <commit_message>"
    exit 1
fi

# Commit message
commit_message="$1"

# Add all changes to the staging area
git add .

# Commit changes with the provided message
git commit -m "$commit_message"

# Push changes to the remote repository
git push -u origin main
