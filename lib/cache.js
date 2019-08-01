const Cache = require('sync-disk-cache');
const getRepoInfo = require('git-repo-info');

const gitInfo = getRepoInfo();
const cache = new Cache(`ember-codemods-telemetry-helpers-${gitInfo.sha}-${process.cwd()}`);

module.exports = cache;
