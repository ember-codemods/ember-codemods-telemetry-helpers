const puppeteer = require('puppeteer');
const { setTelemetry } = require('../utils/telemetry');

const DEFAULT_PUPPETEER_ARGS = { ignoreHTTPSErrors: true, devtools: true };

module.exports = async function gatherTelemetry(url, gatherFn, ...args) {
  let puppeteerArgs = [...args].pop();
  let supportFns = args;

  if (typeof puppeteerArgs === 'object') {
    supportFns.pop();
  } else {
    puppeteerArgs = {};
  }
  Object.assign(puppeteerArgs, DEFAULT_PUPPETEER_ARGS);

  const browser = await puppeteer.launch(puppeteerArgs);
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
          telemetry[modulePath] = await gFn(module, modulePath);
        } catch (error) {
          // log the error, but continue
          window.logErrorInNodeProcess(`error evaluating \`${modulePath}\`: ${error.message}`);
        }
      }
      return telemetry;
    },
    gatherFn,
    ...supportFns
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
