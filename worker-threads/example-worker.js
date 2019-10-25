const {
  isMainThread,
  parentPort,
  threadId,
  MessageChannel
} = require("worker_threads");
const { createWorker } = require("./utils");

if (isMainThread) {
  const worker = createWorker(__filename, {
    msgCallback: (err, msg) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("----", msg);
    },
    exitCallBack: code => {
      console.log(">>>>>", code);
    }
  });

  setInterval(() => {
    worker.postMessage(" main msg " + Date.now());
  }, 3000);
} else {
  parentPort.on("message", msg => {
    console.log(threadId, "----worker receive msg:", msg);
    parentPort.postMessage(`child ${threadId} msg`);
  });
}
