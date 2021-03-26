const fs = require('fs-extra');
const path = require('path');
const walkSync = require('walk-sync');

const ADDON_PATHS = {};
const APP_PATHS = {};

const cwd = process.cwd();

let packagePaths = walkSync(cwd, {
  globs: ['**/package.json'],
  ignore: ['**/tmp/**', '**/node_modules/**'],
});

for (let packagePath of packagePaths) {
  let pkg = fs.readJsonSync(packagePath);

  let packageDir = path.dirname(path.resolve(cwd, packagePath));

  if (pkg.keywords && pkg.keywords.includes('ember-addon')) {
    // build addon instance
    ADDON_PATHS[packageDir] = getAddonPackageName(packagePath);
  } else if (isEmberCliProject(pkg)) {
    APP_PATHS[packageDir] = pkg.name;
  }
}

/**
 * takes a package path and returns the runtime name of the addon.
 *
 * @param {String} packagePath the path on disk (from current working directory)
 * @returns {String} The runtime name of the addon
 */
function getAddonPackageName(packagePath) {
  const pkg = require(packagePath);
  const entryPoint =
    pkg['ember-addon'] && pkg['ember-addon'].main ? pkg['ember-addon'].main : 'index.js';

  let moduleName = pkg.name;
  try {
    let entryModule = require(path.join(packagePath, entryPoint));
    if (typeof entryModule.moduleName === 'function') {
      moduleName = entryModule.moduleName();
    }
  } catch {
    // do nothing, this falls back to using package name
  }

  return moduleName;
}

function isEmberCliProject(pkg) {
  return (
    pkg &&
    ((pkg.dependencies && Object.keys(pkg.dependencies).indexOf('ember-cli') !== -1) ||
      (pkg.devDependencies && Object.keys(pkg.devDependencies).indexOf('ember-cli') !== -1))
  );
}

/**
 * Transforms a literal "on disk" path to a "module path".
 *
 * @param {String} filePath the path on disk (from current working directory)
 * @returns {String} The in-browser module path for the specified filePath
 */
function getModulePathFor(filePath, addonPaths = ADDON_PATHS, appPaths = APP_PATHS) {
  let bestMatch = '';
  let moduleNameRoot, relativePath, isApp, result;

  for (let addonPath in addonPaths) {
    if (filePath.startsWith(addonPath) && addonPath.length > bestMatch.length) {
      bestMatch = addonPath;
      moduleNameRoot = addonPaths[addonPath];
      relativePath = filePath.slice(
        addonPath.length + 1 /* for slash */,
        -path.extname(filePath).length
      );
    }
  }

  for (let appPath in appPaths) {
    if (filePath.startsWith(appPath) && appPath.length > bestMatch.length) {
      bestMatch = appPath;
      moduleNameRoot = appPaths[appPath];
      relativePath = filePath.slice(
        appPath.length + 1 /* for slash */,
        -path.extname(filePath).length
      );
      isApp = true;
    }
  }

  // this is pretty odd, but our tests in
  // transforms/ember-object/__testfixtures__ don't actually live in an ember
  // app or addon, so the standard logic above doesn't work for them
  //
  // this works by passing through the input file name when we are operating
  // on the local ember-es6-class-codemod repo **and** we were not able to
  // resolve a relativePath via normal means
  let isLocallyTesting = process.cwd() === path.resolve(__dirname, '../../..');

  if (!relativePath || isLocallyTesting) {
    let result = filePath.replace(/\.[^/.]+$/, '');

    return result;
  }

  if (!relativePath) {
    return;
  }

  if (isApp) {
    if (relativePath.startsWith('app')) {
      result = `${moduleNameRoot}${relativePath.slice(3)}`;
    } else if (relativePath.startsWith('tests')) {
      result = `${moduleNameRoot}/${relativePath}`;
    }
  } else {
    if (relativePath.startsWith('addon-test-support')) {
      result = `${moduleNameRoot}/test-support${relativePath.slice(18)}`;
    } else if (relativePath.startsWith('addon')) {
      result = `${moduleNameRoot}${relativePath.slice(5)}`;
    }
  }

  return result;
}

module.exports = {
  getModulePathFor,
};
