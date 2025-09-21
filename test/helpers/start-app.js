const execa = require('execa');
const path = require('path');

module.exports = async function startApp(appPath) {
  const classicAppDir = path.resolve(appPath);
  const execOpts = { cwd: classicAppDir, stderr: 'inherit', preferLocal: true };

  console.log('starting serve');

  // `yarn` has a bug where even if the process gets killed, it leaves the child process (ember in this case) orphaned.
  // Hence we are using `ember` directly here to overcome the above shortcoming and ensure that the ember process is always killed
  // cleanly.
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
  };

  return { emberServe };
};
