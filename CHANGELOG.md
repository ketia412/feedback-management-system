# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-08

### Added
- Initial release of Feedback Management System
- RESTful API with Express.js
- Health check endpoint
- Feedback submission and retrieval endpoints
- In-memory storage for feedback data
- Input validation for feedback submissions
- Comprehensive unit and integration tests
- Docker containerization with multi-stage builds
- CI/CD pipeline with GitHub Actions
- Automated testing in CI pipeline
- Docker Hub integration for image publishing
- Test coverage reporting (93.54%)

### Features
- POST /api/feedback - Submit new feedback
- GET /api/feedback - Retrieve all feedback
- GET /api/feedback/:id - Get specific feedback
- GET /health - Health check endpoint

### Technical
- Node.js 18+
- Express.js framework
- Jest testing framework
- Docker containerization
- GitHub Actions CI/CD
- Code coverage: 93.54%