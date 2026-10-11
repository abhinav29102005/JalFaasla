#!/usr/bin/env bash
set -euo pipefail

echo "=========================================================="
echo "  JalFaasla (ਜਲ ਫ਼ਾਸਲਾ) — Production AWS Cloud Deployment"
echo "=========================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== Step 1: Validating & Testing Backend Hydrology Engine ==="
cd "$ROOT_DIR/backend"
if command -v uv &> /dev/null; then
    uv run pytest
elif command -v pytest &> /dev/null; then
    pytest
fi

echo "=== Step 2: SAM Build & CloudFormation Stack Deployment ==="
cd "$ROOT_DIR/aws"
sam build --cached --parallel
sam deploy --config-file samconfig.toml --no-confirm-changeset

STACK_NAME="building-momentum-jalfaasla"
REGION="ap-southeast-2"
PROFILE="building-momentum"

FRONTEND_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --profile "$PROFILE" \
    --query "Stacks[0].Outputs[?OutputKey=='FrontendBucketName'].OutputValue" \
    --output text)

CLOUDFRONT_ID=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --profile "$PROFILE" \
    --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" \
    --output text || echo "")

CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --profile "$PROFILE" \
    --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionUrl'].OutputValue" \
    --output text || echo "")

echo "Target S3 Bucket: $FRONTEND_BUCKET"
echo "Target CloudFront Distribution: $CLOUDFRONT_ID"

echo "=== Step 3: Compiling Production React 19 Frontend SPA ==="
cd "$ROOT_DIR/frontend"
npm run build

echo "=== Step 4: Syncing Static Assets to S3 Origin ==="
aws s3 sync dist/ "s3://${FRONTEND_BUCKET}/" --delete --profile "$PROFILE" --region "$REGION"

echo "=== Step 5: Invalidating CloudFront Edge Cache ==="
if [ -n "$CLOUDFRONT_ID" ] && [ "$CLOUDFRONT_ID" != "None" ]; then
    aws cloudfront create-invalidation \
        --distribution-id "$CLOUDFRONT_ID" \
        --paths "/*" \
        --profile "$PROFILE"
fi

echo "=========================================================="
echo "  ✅ Deployment Complete!"
echo "  Live CloudFront URL: $CLOUDFRONT_URL"
echo "=========================================================="
