const {
  isMainThread,
  parentPort,
  threadId,
  MessageChannel
} = require("worker_threads");
const { createWorker } = require("./utils");

const channel = new MessageChannel();

if (isMainThread) {
  const worker1 = createWorker(__filename, {
    msgCallback: (err, msg) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("1----", msg);
    },
    exitCallBack: code => {
      console.log("1>>>>>", code);
    },
    channelPort: channel.port1
  });
  const worker2 = createWorker(__filename, {
    msgCallback: (err, msg) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("2----", msg);
    },
    exitCallBack: code => {
      console.log("2>>>>>", code);
    },
    channelPort: channel.port2
  });
} else {
  parentPort.once("message", msg => {
    console.log(threadId, "----worker receive msg:", msg);
    if (msg.channelPort) {
      msg.channelPort.on("message", v => {
        console.log(threadId, "============", v);
      });

      setInterval(() => {
        msg.channelPort.postMessage(threadId + "  " + Date.now());
      }, 5000);
    }
  });
}
