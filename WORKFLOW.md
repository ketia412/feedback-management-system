# Workflow and Standards

## Branching
- `main`: production-ready
- `develop`: integration branch
- `feature/*`: short-lived feature branches

## Pull Requests
- Target `develop` (or `main` for hotfixes)
- Require at least one review
- All checks (CI) must pass

## Commits
- Prefer Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`
- Small, logical commits; reference issues when applicable

## CI/CD
- CI runs on pushes/PRs to `main` and `develop`
- CD runs on `main`: builds image, pushes to Docker Hub, deploys to Kubernetes
- Releases: push tag `v*` to trigger release workflow and versioned images

