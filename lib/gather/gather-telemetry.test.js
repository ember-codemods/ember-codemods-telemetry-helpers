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

function outer(possibleEmberObject) {
  let obj = possibleEmberObject.default;
  if (obj && obj.name) {
    return obj.name === 'jQuery';
  }
  return false;
}

function inner(possibleEmberObject) {
  return outer(possibleEmberObject);
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

  test('can determine most Ember types with a robust function', async () => {
    await gatherTelemetry('http://localhost:4200', analyzeEmberObject);
    let telemetry = getTelemetry();

    let expected = [
      '@ember/render-modifiers/modifiers/did-insert',
      '@ember/render-modifiers/modifiers/did-update',
      '@ember/render-modifiers/modifiers/will-destroy',
      'ember-ajax/ajax-request',
      'ember-ajax/services/ajax',
      'ember-class-based-modifier/-private/modifier-classic',
      'ember-class-based-modifier/classic',
      'ember-data/adapter',
      'ember-data/adapters/json-api',
      'ember-data/adapters/rest',
      'ember-data/model',
      'ember-data/serializer',
      'ember-data/serializers/json-api',
      'ember-data/serializers/json',
      'ember-data/serializers/rest',
      'ember-data/store',
      'ember-data/transform',
      'ember-data/transforms/boolean',
      'ember-data/transforms/date',
      'ember-data/transforms/number',
      'ember-data/transforms/string',
      'ember-data/transforms/transform',
      'ember-inflector/lib/helpers/pluralize',
      'ember-inflector/lib/helpers/singularize',
      'ember-resolver/index',
      'ember-resolver/resolver',
      'ember-resolver/resolvers/classic/container-debug-adapter',
      'ember-resolver/resolvers/classic/index',
      'ember-welcome-page/components/welcome-page',
      'special-sauce/components/fire-sauce',
      'input/app',
      'input/components/test-component',
      'input/components/welcome-page',
      'input/helpers/app-version',
      'input/helpers/pluralize',
      'input/helpers/singularize',
      'input/modifiers/did-insert',
      'input/modifiers/did-update',
      `input/modifiers/logger`,
      'input/modifiers/will-destroy',
      'input/resolver',
      'input/router',
      'input/services/ajax',
    ];

    expect(Object.keys(telemetry)).toEqual(expected);
  });

  test('can handle external functions', async () => {
    await gatherTelemetry('http://localhost:4200', inner, outer);
    let telemetry = getTelemetry();
    expect(Object.values(telemetry).filter(Boolean).length).toEqual(1);
  });

  afterAll(async () => {
    console.log(`Killing PID: ${app.emberServe.pid}`);
    await app.emberServe.kill('SIGTERM', {
      forceKillAfterTimeout: 200,
    });
  }, APP_TIMEOUT);
});
