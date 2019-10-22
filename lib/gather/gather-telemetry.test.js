const startApp = require('../../test/helpers/start-app');
const gatherTelemetry = require('./gather-telemetry');
const { getTelemetry } = require('../utils/telemetry');
const analyzeEmberObject = require('../gather/analyze-ember-object');
const APP_TIMEOUT = 100000;

function helper(possibleEmberObject) {
  if (
    possibleEmberObject &&
    possibleEmberObject.default &&
    possibleEmberObject.default.isHelperFactory
  ) {
    return true;
  }
}

describe('Provide a personalized `Gathering Function`', () => {
  let app;
  let localAppPath = './test/fixtures/classic-app';
  beforeAll(async () => {
    app = await startApp(localAppPath);
    console.log(`Spawned PID: ${app.emberServe.pid}`);
  }, APP_TIMEOUT);

  test('can determine helpers with simple a function', async () => {
    await gatherTelemetry('http://localhost:4200', helper);
    let telemetry = getTelemetry();
    expect(telemetry).toEqual({
      'ember-inflector/lib/helpers/pluralize': true,
      'ember-inflector/lib/helpers/singularize': true,
      'input/helpers/app-version': true,
      'input/helpers/pluralize': true,
      'input/helpers/singularize': true,
    });
  });

  test('can determine components with a robust function', async () => {
    await gatherTelemetry('http://localhost:4200', analyzeEmberObject);
    let telemetry = getTelemetry();
    expect(Object.keys(telemetry).filter(Boolean).length).toEqual(29);
  });

  afterAll(async () => {
    console.log(`Killing PID: ${app.emberServe.pid}`);
    await app.emberServe.kill('SIGTERM', {
      forceKillAfterTimeout: 200,
    });
  }, APP_TIMEOUT);
});
