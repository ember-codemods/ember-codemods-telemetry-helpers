const execa = require('execa');
const path = require('path');

module.exports = async function startApp(appPath) {
  const classicAppDir = path.resolve(appPath);
  const execOpts = { cwd: classicAppDir, stderr: 'inherit', preferLocal: true };
  console.log('installing deps');

  await execa('rm', ['-rf', 'node_modules'], execOpts);
  await execa('yarn', ['install'], execOpts);

  console.log('starting serve');
  const emberServe = execa('ember', ['serve'], execOpts);
  emberServe.stdout.pipe(process.stdout);

  await new Promise(resolve => {
    emberServe.stdout.on('data', data => {
      let dataAsStr = data.toString();
      if (dataAsStr.includes('Build successful')) {
        resolve();
      }
    });
  });

  emberServe.shutdown = async function() {
    this.kill();
    try {
      await this;
    } catch (e) {
      // Process is allowed to exit with a non zero exit status code.
    }
    if (!this.killed) {
      throw new Error(`the process ${this.pid} wasn't killed.`);
    }
  };

  return { emberServe };
};
