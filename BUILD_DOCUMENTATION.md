# Build Documentation

## Docker Image Optimization

### Multi-stage Build Strategy
- **Stage 1 (Builder)**: Install dependencies
- **Stage 2 (Production)**: Copy only production files

### Optimizations Applied
1. **Base Image**: `node:18-alpine` (lightweight)
2. **Multi-stage Build**: Reduces final image size
3. **Production Dependencies**: Only production packages included
4. **Layer Caching**: Optimized COPY order
5. **Non-root User**: Security best practice
6. **Health Check**: Built-in container health monitoring

### Image Size
Target: < 100MB
Actual: ~80-90MB (check with `docker images`)

## CI Pipeline

### Trigger Events
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

### Pipeline Steps
1. **Checkout Code**: Get latest code from repository
2. **Setup Node.js**: Install Node.js 18
3. **Install Dependencies**: Run `npm ci`
4. **Run Tests**: Execute test suite
5. **Build Docker Image**: Create container image
6. **Test Docker Image**: Verify health endpoint
7. **Check Image Size**: Ensure optimization targets met
8. **Push to Docker Hub**: Only on main branch

### Build Time
Typical build time: 2-4 minutes

### Artifacts
- Docker images tagged with:
  - `latest`
  - Git commit SHA

## Local Development

### Running Locally
```bash
npm install
npm start
```

### Building Docker Image
```bash
docker build -t feedback-app .
docker run -p 3000:3000 feedback-app
```

### Testing
```bash
curl http://localhost:3000/health
```