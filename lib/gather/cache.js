const Cache = require('sync-disk-cache');
const getRepoInfo = require('git-repo-info');

const gitInfo = getRepoInfo();

const cwd = process.cwd().replace(':', '꞉');

const cachePath = `ember-codemods-telemetry-helpers-${gitInfo.sha}-${cwd}`;

const cache = new Cache(cachePath);

module.exports = cache;
