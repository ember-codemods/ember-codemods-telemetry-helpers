const puppeteer = require('puppeteer');
const { setTelemetry } = require('../utils/telemetry');

const DEFAULT_PUPPETEER_ARGS = { ignoreHTTPSErrors: true };

module.exports = async function gatherTelemetry(url, gatherFn, puppeteerArgs = {}) {
  Object.assign(puppeteerArgs, DEFAULT_PUPPETEER_ARGS);

  const browser = await puppeteer.launch(puppeteerArgs);
  const page = await browser.newPage();

  await page.goto(url);

  await page.exposeFunction('logErrorInNodeProcess', message => {
    console.error(message); // eslint-disable-line no-console
  });

  const telemetry = await bridgeEvaluate(
    page,
    async gFn => {
      const SKIPPED_MODULES = ['fetch/ajax'];
      /* globals window,*/
      let telemetry = {};
      const modules = Object.keys(window.require.entries);

      for (let modulePath of modules) {
        if (SKIPPED_MODULES.includes(modulePath)) {
          continue;
        }

        try {
          let module = require(modulePath);
          telemetry[modulePath] = await gFn(module);
        } catch (error) {
          // log the error, but continue
          window.logErrorInNodeProcess(`error evaluating \`${modulePath}\`: ${error.message}`);
        }
      }
      return telemetry;
    },
    gatherFn
  );

  setTelemetry(telemetry);
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
