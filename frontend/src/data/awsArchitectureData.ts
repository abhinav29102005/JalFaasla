export interface AwsServiceDetail {
  id: string;
  serviceName: string;
  category: 'Frontend & PWA' | 'Compute & API' | 'Database' | 'Storage' | 'Orchestration & Cron' | 'Messaging & Alerts' | 'AI & Analytics' | 'Search & Observability';
  purposeInJalFaasla: string;
  punjabScaleMetric: string;
  awsIconBadge: string;
  keyFeature: string;
}

export const AWS_ARCHITECTURE_DATA: AwsServiceDetail[] = [
  {
    id: "amplify",
    serviceName: "AWS Amplify Hosting",
    category: "Frontend & PWA",
    purposeInJalFaasla: "Hosts the React/Next.js progressive web app (PWA) with multilingual Punjabi, Hindi, and English support. Delivers lightning-fast edge caching across northern India via Amazon CloudFront.",
    punjabScaleMetric: "Offline-first PWA caching for rural Punjab mobile networks (2G/4G bandwidth tolerance).",
    awsIconBadge: "AWS Amplify",
    keyFeature: "Automatic CI/CD git deployments, SSR & static asset edge caching, responsive mobile bundle."
  },
  {
    id: "api-gateway",
    serviceName: "Amazon API Gateway + AWS Lambda",
    category: "Compute & API",
    purposeInJalFaasla: "Serverless RESTful APIs handling farmer onboarding, groundwater risk scoring, legal calendar verification, and rain-aware irrigation triggers without managing servers.",
    punjabScaleMetric: "Handles surge of 500,000+ Punjab farmers querying during peak 10 May - 20 June sowing windows at near-zero idle cost.",
    awsIconBadge: "Lambda & API GW",
    keyFeature: "Sub-millisecond cold starts with Rust/Node.js runtimes, JWT auth, rate-limiting per block."
  },
  {
    id: "dynamodb",
    serviceName: "Amazon DynamoDB",
    category: "Database",
    purposeInJalFaasla: "Single-digit millisecond NoSQL storage for Farmer Profiles (partition key: District#Block, sort key: FarmerId), Plot Geometries, Recommendations, and Crowdsourced Well Reports.",
    punjabScaleMetric: "Global Tables readiness with On-Demand capacity scaling during harvest and transplantation peaks.",
    awsIconBadge: "DynamoDB",
    keyFeature: "DynamoDB Streams triggers EventBridge whenever a critical tube-well failure or dry bore is reported."
  },
  {
    id: "s3",
    serviceName: "Amazon Simple Storage Service (S3)",
    category: "Storage",
    purposeInJalFaasla: "Stores PAU crop advisories, CGWB district GIS shapefiles, high-resolution satellite NDVI raster layers, and farmer-uploaded field photo evidence.",
    punjabScaleMetric: "99.999999999% (11 9s) durability with S3 Intelligent-Tiering for seasonal crop images.",
    awsIconBadge: "Amazon S3",
    keyFeature: "Pre-signed URLs for secure direct image upload from farmer mobile cameras."
  },
  {
    id: "eventbridge",
    serviceName: "Amazon EventBridge",
    category: "Orchestration & Cron",
    purposeInJalFaasla: "Scheduled event buses running daily 5:00 AM weather pulls from IMD (India Meteorological Department), refreshing block water-table tables, and triggering irrigation schedule updates.",
    punjabScaleMetric: "Coordinates 150+ Punjab blocks with cron schedules synced to sunrise and pump timings.",
    awsIconBadge: "EventBridge",
    keyFeature: "Decoupled event routing between weather ingestion, advisory computation, and SMS alerts."
  },
  {
    id: "sns",
    serviceName: "Amazon Simple Notification Service (SNS)",
    category: "Messaging & Alerts",
    purposeInJalFaasla: "Sends timely SMS and WhatsApp notifications to registered farmers: 'Rain expected Thursday in Jagraon—turn off your tube-well and save ₹1,450!'",
    punjabScaleMetric: "Direct-to-farmer SMS across Ludhiana, Sangrur, and Moga with Punjabi language SMS templates.",
    awsIconBadge: "Amazon SNS",
    keyFeature: "High-throughput fanout to mobile carriers with failure fallbacks and WhatsApp Business API bridge."
  },
  {
    id: "sagemaker",
    serviceName: "Amazon SageMaker AI / Strands Agents SDK",
    category: "AI & Analytics",
    purposeInJalFaasla: "Hosts the agronomic water-demand and crop-suitability model. Powers the Strands conversational agent for natural-language farming queries in spoken Punjabi and Hindi.",
    punjabScaleMetric: "Multi-model endpoint inferring crop water deficit index from ET0 and soil moisture curves.",
    awsIconBadge: "SageMaker AI",
    keyFeature: "Fine-tuned LLM grounding on PAU package of practices and Subsoil Water Act legal texts."
  },
  {
    id: "opensearch",
    serviceName: "Amazon OpenSearch Service",
    category: "Search & Observability",
    purposeInJalFaasla: "Instant autocomplete and geo-search across 12,000+ Punjab villages, tehsils, seed varieties (PR-126, PMH-13), and historical advisory knowledge base.",
    punjabScaleMetric: "Sub-50ms fuzzy search supporting Gurmukhi phonetic transliteration (e.g. Jagraon or ਜਗਰਾਉਂ).",
    awsIconBadge: "OpenSearch",
    keyFeature: "k-NN vector search for matching farmer queries with official PAU research bulletins."
  },
  {
    id: "cloudwatch",
    serviceName: "Amazon CloudWatch & X-Ray",
    category: "Search & Observability",
    purposeInJalFaasla: "Real-time telemetry, model drift detection, API latency monitoring, and automated alerts if weather ingestion jobs fail.",
    punjabScaleMetric: "Monitors advisory accuracy against actual farmer reported rainfall and pump hours.",
    awsIconBadge: "CloudWatch",
    keyFeature: "Custom CloudWatch Dashboards tracking total cubic meters of groundwater saved across Punjab."
  }
];
