const puppeteer = require('puppeteer');
const { setTelemetryWithKey } = require('../utils/telemetry');

const DEFAULT_PUPPETEER_ARGS = { ignoreHTTPSErrors: true };

module.exports = async function gatherSingleTelemetry(url, options = {}, gatherFn, ...args) {
  const browser = await puppeteer.launch(DEFAULT_PUPPETEER_ARGS);
  const page = await browser.newPage();

  await page.goto(url);

  await page.exposeFunction('logErrorInNodeProcess', message => {
    console.error(message); // eslint-disable-line no-console
  });

  const telemetry = await bridgeEvaluate(
    page,
    async (gFn, ...supportFns) => {
      supportFns.forEach(fn => {
        this[fn.name] = fn;
      });
      let telemetry = {};

      telemetry = await gFn(...supportFns);
      return telemetry;
    },
    gatherFn,
    ...args
  );

  setTelemetryWithKey(options.telemetryKey, telemetry);
  await browser.close();

  async function bridgeEvaluate(page, fn, ...rawArgs) {
    const args = await Promise.all(
      rawArgs.map(arg => {
        return typeof arg === 'function' ? page.evaluateHandle(`(${arg.toString()})`) : arg;
      })
    );
    return page.evaluate(fn, ...args);
  }
};
