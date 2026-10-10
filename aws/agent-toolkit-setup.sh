#!/usr/bin/env bash
set -e

PROFILE_NAME=${1:-"jalfaasla-project"}
REGION="ap-southeast-2"
TOOLKIT_REGION="us-east-1"

echo "=== JalFaasla: Agent Toolkit for AWS Setup ==="
echo "AWS Region: $REGION"
echo "Profile:    $PROFILE_NAME"
echo "Experience: The new AWS experience (project-based)"
echo ""

echo "Step 1: Setting default region for profile..."
aws configure set region "$REGION" --profile "$PROFILE_NAME"

echo "Step 2: Browser login (credentials valid 12 hours, renewable 90 days)..."
aws login --region "$REGION" --profile "$PROFILE_NAME"

echo "Step 3: Verifying caller identity..."
aws sts get-caller-identity --profile "$PROFILE_NAME"

echo "Step 4: Configuring Agent Toolkit in $TOOLKIT_REGION..."
aws configure agent-toolkit --yes --region "$TOOLKIT_REGION" --profile "$PROFILE_NAME"

echo "Step 5: Verifying remote catalog skills..."
aws agent-toolkit list-available-skills --region "$TOOLKIT_REGION" --profile "$PROFILE_NAME"

echo ""
echo "=== Setup Complete! ==="
