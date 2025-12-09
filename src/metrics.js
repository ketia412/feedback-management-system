// Simple metrics
let requestCount = 0;
let feedbackCount = 0;
const startTime = Date.now();

function trackRequest() {
  requestCount++;
}

function trackFeedback() {
  feedbackCount++;
}

function getMetrics() {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  return `# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total ${requestCount}

# HELP feedbacks_total Total feedbacks
# TYPE feedbacks_total counter
feedbacks_total ${feedbackCount}

# HELP app_uptime_seconds App uptime
# TYPE app_uptime_seconds gauge
app_uptime_seconds ${uptime}
`;
}

module.exports = { trackRequest, trackFeedback, getMetrics };