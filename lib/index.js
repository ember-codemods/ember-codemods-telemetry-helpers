const gatherTelemetryForUrl = require('./gather/gather-telemetry');
const gatherSingleTelemetryForUrl = require('./gather/gather-single-telemetry.js');
const { getModulePathFor } = require('./utils/get-module-path-for');
const {
  getTelemetry,
  setTelemetry,
  setTelemetryWithKey,
  getTelemetryFor,
} = require('./utils/telemetry');
const analyzeEmberObject = require('./gather/analyze-ember-object');

module.exports = {
  getTelemetry,
  setTelemetry,
  setTelemetryWithKey,
  gatherTelemetryForUrl,
  gatherSingleTelemetryForUrl,
  getTelemetryFor,
  getModulePathFor,
  analyzeEmberObject,
};
