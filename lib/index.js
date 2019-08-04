const gatherTelemetryForUrl = require('./gather/gather-telemetry');
const { getTelemetryFor, getModulePathFor, getTelemetry } = require('./utils/get-telemetry-for');

module.exports = {
  getTelemetry,
  gatherTelemetryForUrl,
  getTelemetryFor,
  getModulePathFor,
};
