# Feedback Management System

A simple Node.js REST API for managing user feedback.

## Features
- Submit feedback
- View all feedback
- Get feedback by ID
- Health check endpoint

## Tech Stack
- Node.js
- Express.js
- Docker
- Kubernetes

## Branching Strategy
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches

## Git Workflow
1. Create feature branch from develop
2. Make changes and commit
3. Push and create Pull Request
4. Code review required
5. Merge to develop
6. Release to main

## Commit Message Standards
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test additions/changes
- `refactor:` - Code refactoring
- `chore:` - Build/tool changes

Example: `feat: add POST endpoint for feedback submission`