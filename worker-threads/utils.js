const { Worker } = require("worker_threads");

function createWorker(
  workerFilePath,
  opts = {
    workerData: null,
    msgCallback: (err, msg) => {},
    exitCallBack: code => {},
    channelPort: null
  }
) {
  const worker = new Worker(workerFilePath, { workerData: opts.workerData });
  worker.on("message", msg => opts.msgCallback(null, msg));
  worker.on("error", err => opts.msgCallback(err, null));
  worker.on("exit", opts.exitCallBack);
  if (opts.channelPort) {
    worker.postMessage({ channelPort: opts.channelPort }, [opts.channelPort]);
  }
  return worker;
}

module.exports = { createWorker };
