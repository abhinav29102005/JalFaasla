# JalFaasla (ਜਲ ਫ਼ਾਸਲਾ) — Production AWS PowerShell Deployment Script
$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  JalFaasla (ਜਲ ਫ਼ਾਸਲਾ) — Production AWS Cloud Deployment" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir

# Step 1: Backend tests
Write-Host "`n=== Step 1: Validating & Testing Backend Hydrology Engine ===" -ForegroundColor Yellow
Set-Location "$RootDir\backend"
if (Get-Command uv -ErrorAction SilentlyContinue) {
    uv run pytest
} elseif (Get-Command pytest -ErrorAction SilentlyContinue) {
    pytest
}

# Step 2: SAM Build & Deploy
Write-Host "`n=== Step 2: SAM Build & CloudFormation Stack Deployment ===" -ForegroundColor Yellow
Set-Location "$RootDir\aws"
sam build --cached --parallel
sam deploy --config-file samconfig.toml --no-confirm-changeset

$StackName = "building-momentum-jalfaasla"
$Region = "ap-southeast-2"
$Profile = "building-momentum"

$FrontendBucket = (aws cloudformation describe-stacks `
    --stack-name $StackName `
    --region $Region `
    --profile $Profile `
    --query "Stacks[0].Outputs[?OutputKey=='FrontendBucketName'].OutputValue" `
    --output text).Trim()

$CloudFrontId = (aws cloudformation describe-stacks `
    --stack-name $StackName `
    --region $Region `
    --profile $Profile `
    --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" `
    --output text).Trim()

$CloudFrontUrl = (aws cloudformation describe-stacks `
    --stack-name $StackName `
    --region $Region `
    --profile $Profile `
    --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionUrl'].OutputValue" `
    --output text).Trim()

Write-Host "Target S3 Bucket: $FrontendBucket" -ForegroundColor Green
Write-Host "Target CloudFront Distribution: $CloudFrontId" -ForegroundColor Green

# Step 3: Frontend Build
Write-Host "`n=== Step 3: Compiling Production React 19 Frontend SPA ===" -ForegroundColor Yellow
Set-Location "$RootDir\frontend"
npm run build

# Step 4: S3 Sync
Write-Host "`n=== Step 4: Syncing Static Assets to S3 Origin ===" -ForegroundColor Yellow
aws s3 sync dist/ "s3://$FrontendBucket/" --delete --profile $Profile --region $Region

# Step 5: Invalidate CloudFront
Write-Host "`n=== Step 5: Invalidating CloudFront Edge Cache ===" -ForegroundColor Yellow
if ($CloudFrontId -and $CloudFrontId -ne "None") {
    aws cloudfront create-invalidation `
        --distribution-id $CloudFrontId `
        --paths "/*" `
        --profile $Profile
}

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "  ✅ Deployment Complete!" -ForegroundColor Green
Write-Host "  Live CloudFront URL: $CloudFrontUrl" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
