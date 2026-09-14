

```markdown
# Mentra — Autonomous Career Navigation Agent 🧭

Mentra is an AI-powered career orchestration platform designed to bridge the gap between formal education and technical hiring. It benchmarks professional profiles against target technical roles, diagnoses critical skill gaps, and generates structured, multi-phase execution roadmaps.

Built for cloud-native deployment, Mentra leverages Google Cloud services and the Gemini API to provide personalized career intelligence.

> **🏆 Built For:** Gen AI Academy APAC Ideathon 

## Live Prototype
[Experience Mentra Live](https://mentra-346119786628.asia-southeast1.run.app)

## Architecture & Google Cloud Integration

Mentra is architected using a modern, lightweight cloud stack:

- **Firebase Authentication:** Handles Google Sign-In and user identity verification.
- **Cloud Firestore:** Manages persistent user and application data storage with UID-scoped access rules.
- **Gemini API (AI Studio):** Functions as the analytical reasoning engine for role matching, gap analysis, and roadmap generation using structured JSON outputs.
- **Google Cloud Run:** Hosts the containerized production web application, handling automatic scaling based on traffic.

## Key Features

- **AI-Powered Resume Benchmarking:** Analyzes candidate experience against a target technical role and generates a baseline role-match score.
- **Skill Gap Analysis:** Identifies missing technical and architectural skills required for the target role.
- **Actionable 4-Week Roadmaps:** Generates structured, day-by-day execution steps to address identified skill gaps.
- **Multi-Turn Mentor Chat:** Allows users to ask contextual follow-up questions regarding their personalized roadmap.
- **Lunar Chrome UI:** A minimal, dark-mode interface designed specifically for developer workflows.

## Project Structure

```text
mentra/
├── app.py                  # Flask backend API & Gemini integration routes
├── requirements.txt        # Python dependencies
├── Dockerfile              # Containerization configuration for Cloud Run
├── static/                 # Frontend assets, stylesheets, and client scripts
└── templates/              # HTML layout and dashboard views

```

## Local Development

1. Clone the repository and navigate to the project directory.
2. Install the required dependencies:
```bash
pip install -r requirements.txt

```


3. Set your environment variables (Firebase credentials and Gemini API key).
4. Run the Flask development server:
```bash
python app.py

```



