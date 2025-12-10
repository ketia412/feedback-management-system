const { trackRequest, trackFeedback, getMetrics } = require('../src/metrics');

describe('Metrics module', () => {
  it('increments counters and exposes metrics text', () => {
    // Increment counters (stateful module)
    trackRequest();
    trackRequest();
    trackFeedback();

    const metrics = getMetrics();

    // Extract numbers without assuming a clean slate
    const reqMatch = metrics.match(/http_requests_total (\d+)/);
    const fbMatch = metrics.match(/feedbacks_total (\d+)/);

    expect(reqMatch).toBeTruthy();
    expect(fbMatch).toBeTruthy();
    expect(parseInt(reqMatch[1], 10)).toBeGreaterThanOrEqual(2);
    expect(parseInt(fbMatch[1], 10)).toBeGreaterThanOrEqual(1);
    expect(metrics).toMatch(/app_uptime_seconds \d+/);
  });
});

