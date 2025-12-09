# Release Management Documentation

## Semantic Versioning

This project follows [Semantic Versioning](https://semver.org/):

**MAJOR.MINOR.PATCH** (e.g., 1.0.0)

- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality (backwards-compatible)
- **PATCH**: Bug fixes (backwards-compatible)

## Current Version

**v1.0.0** - Initial release

## Release Process

### 1. Update Version

Update version in `package.json`:
```json
{
  "version": "1.0.0"
}
```

### 2. Update Changelog

Add changes to `CHANGELOG.md`:
```markdown
## [1.0.0] - 2025-12-08
### Added
- Feature description
```

### 3. Commit Changes
```bash
git add package.json CHANGELOG.md
git commit -m "chore: bump version to 1.0.0"
git push origin main
```

### 4. Create Git Tag
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### 5. Automated Release

Once tag is pushed:
- Release workflow automatically triggers
- Tests run to verify stability
- Docker images built with version tag
- Images pushed to Docker Hub:
  - `username/feedback-app:1.0.0`
  - `username/feedback-app:latest`
- GitHub Release created with notes

## Release Artifacts

### Docker Images

Each release generates:
1. **Versioned image**: `username/feedback-app:1.0.0`
2. **Latest image**: `username/feedback-app:latest`

### Pull and Run
```bash
# Pull specific version
docker pull username/feedback-app:1.0.0

# Run container
docker run -d -p 3000:3000 --name feedback-app username/feedback-app:1.0.0
```

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0   | 2025-12-08 | Initial release with core features |

## Rollback Strategy

To rollback to previous version:
```bash
# Pull previous version
docker pull username/feedback-app:0.9.0

# Stop current container
docker stop feedback-app
docker rm feedback-app

# Run previous version
docker run -d -p 3000:3000 --name feedback-app username/feedback-app:0.9.0
```

## Release Checklist

- [ ] Update version in package.json
- [ ] Update CHANGELOG.md
- [ ] Run tests locally (`npm test`)
- [ ] Commit version changes
- [ ] Create and push Git tag
- [ ] Verify release workflow passes
- [ ] Verify Docker images on Docker Hub
- [ ] Verify GitHub Release created
- [ ] Test deployed application