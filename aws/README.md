# JalFaasla AWS Deployment & Agent Toolkit

This folder contains the AWS infrastructure, serverless application configuration (SAM / CloudFormation), and the Agent Toolkit for AWS setup instructions.

## AWS Environment Configuration
- **AWS Region**: `ap-southeast-2` (Asia Pacific - Sydney)
- **AWS Experience**: The new AWS experience (uses project-based permissions and credentials)
- **Architecture**:
  - **Frontend**: AWS S3 Static Website Hosting distributed globally via Amazon CloudFront (HTTPS, low latency edge caching).
  - **Backend**: AWS Lambda (Python 3.14 / Container) running FastAPI via Mangum handler, fronted by Amazon API Gateway HTTP API with direct path routing (`/advisor`, `/groundwater`, `/crops`, etc.).

---

## Agent Toolkit for AWS Setup

Following [AWS Agent Toolkit Instructions](https://raw.githubusercontent.com/aws/agent-toolkit-for-aws/refs/heads/main/setup-instructions/setup.md):

### Prerequisites Check
- `curl`: Verified installed
- `uv`: Verified installed (`0.10.9`)
- `aws` CLI: Installed (`aws-cli/2.33.0`)

### Authentication & Profile
Credentials in the new AWS experience are authenticated via the browser using `aws login` and are valid for **12 hours** (renewable for up to 90 days without re-authenticating in the browser).

To authenticate:
```bash
# 1. Configure default region for your project profile
aws configure set region ap-southeast-2 --profile <your_profile_name>

# 2. Browser login to your AWS project
aws login --region ap-southeast-2 --profile <your_profile_name>

# 3. Verify access
aws sts get-caller-identity --profile <your_profile_name>

# 4. Configure Agent Toolkit (MCP server backend resides in us-east-1)
aws configure agent-toolkit --yes --region us-east-1 --profile <your_profile_name>

# 5. List available skills
aws agent-toolkit list-available-skills --region us-east-1 --profile <your_profile_name>
```

---

## Deploying the Application to AWS
```bash
# Deploy Backend via SAM
cd aws
sam build
sam deploy --guided --region ap-southeast-2

# Deploy Frontend to S3 / CloudFront
cd ../frontend
npm run build
aws s3 sync dist/ s3://<your-bucket-name> --region ap-southeast-2
```
