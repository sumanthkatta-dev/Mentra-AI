

````markdown
# Mentra — Autonomous Career Navigation Agent

Mentra is an AI-powered career orchestration platform designed to bridge the gap between formal education and technical hiring. It benchmarks professional profiles against target technical roles, diagnoses critical skill gaps, and generates structured, multi-phase execution roadmaps.

Built for cloud-native deployment, Mentra leverages Google Cloud services and the Gemini API to provide personalized career intelligence.

## Architecture & Google Cloud Integration

Mentra is architected using a modern cloud stack:

- **Firebase Authentication:** Provides secure Google Sign-In and user authentication.
- **Cloud Firestore:** Provides persistent user and application data storage with UID-scoped access.
- **Gemini API (AI Studio):** Powers the core analytical reasoning engine for role matching, gap analysis, and roadmap generation using structured JSON outputs.
- **Google Cloud Run:** Hosts the containerized production web application with automatic scaling.

## Key Features

- **AI-Powered Resume Benchmarking:** Analyzes candidate experience against a target technical role and generates a role-match score.
- **Skill Gap Analysis:** Identifies high-priority technical and architectural skill gaps.
- **Actionable 4-Week Roadmaps:** Generates structured execution steps to address identified gaps.
- **Multi-Turn Mentor Chat:** Allows users to ask contextual follow-up questions about their roadmap.
- **Lunar Chrome UI:** Minimal dark-mode interface designed for developer workflows.

## Project Structure

```text
mentra/
├── app.py                  # Flask backend API & Gemini integration routes
├── requirements.txt        # Python dependencies
├── Dockerfile              # Containerization configuration for Cloud Run
├── static/                 # Frontend assets, stylesheets, and client scripts
└── templates/              # HTML layout and dashboard views
````

## Live Prototype

[https://mentra-346119786628.asia-southeast1.run.app](https://mentra-346119786628.asia-southeast1.run.app)

## Built For

Gen AI Academy APAC Ideathon

```

### One more thing

Your original README says **"enterprise-grade"**, **"high-performance"**, **"robust session management"**, **"prevent cross-user data leakage"**, and **"real-time"**. Those aren't necessarily wrong, but they're claims an evaluator could challenge.

For an ideathon submission, **credible > impressive-sounding**.

So put the cleaned version in `README.md`, commit it, and then **verify the repo is Public**.

After that, **social post is the next step.**
```
