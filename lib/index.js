const gatherTelemetryForUrl = require('./gather/gather-telemetry');
const { getTelemetryFor, getModulePathFor } = require('./utils/get-telemetry-for');
const { getTelemetry, setTelemetry } = require('./utils/telemetry');

module.exports = {
  getTelemetry,
  setTelemetry,
  gatherTelemetryForUrl,
  getTelemetryFor,
  getModulePathFor,
};
