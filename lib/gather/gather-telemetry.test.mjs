const startApp = require('../../test/helpers/start-app');
const gatherTelemetry = require('./gather-telemetry');
const { getTelemetry } = require('../utils/telemetry');
const analyzeEmberObject = require('../gather/analyze-ember-object');
const APP_TIMEOUT = 100000;

import { describe, test, beforeAll, afterAll, expect } from 'vitest';

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
    expect(Object.values(telemetry).filter(Boolean).length).toEqual(38);
  });

  test('can handle external functions', async () => {
    await gatherTelemetry('http://localhost:4200', inner, outer);
    let telemetry = getTelemetry();
    expect(Object.values(telemetry).filter(Boolean).length).toEqual(1);
  });

  test('can enumerate template only classic components', async () => {
    await gatherTelemetry('http://localhost:4200', analyzeEmberObject);
    let telemetry = getTelemetry();
    let components = Object.values(telemetry).filter(obj => obj.isTemplate);
    expect(components.length).toEqual(4);
    expect(components[0].type).toEqual('Component');
    expect(components[0].isTemplate).toBe(true);
  });

  afterAll(async () => {
    console.log(`Killing PID: ${app.emberServe.pid}`);
    await app.emberServe.shutdown();
  }, APP_TIMEOUT);
});
