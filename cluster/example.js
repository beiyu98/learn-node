const cluster = require("cluster");
const http = require("http");
const os = require("os");

/**
 * cluster.on("message": 监听所有worker中使用process.send发送的数据
 * worker.on("message" : 仅监听当前worker中使用process.send发送的数据
 */

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`);
  for (let i = 0; i < os.cpus().length; i++) {
    const worker = cluster.fork();
    console.log("worker id:", worker.id);
    worker.send("worker id:" + worker.id);
    worker.on("message", msg => {
      console.log("worker id:", worker.id, "on message:", msg);
    });
  }
  cluster.on("message", (worker, msg, signal) => {
    console.log(
      "master receive worker:",
      worker.id,
      "msg=",
      msg,
      " signal=",
      signal
    );
  });
  cluster.on("exit", (worker, code, signal) => {
    console.log(
      "master receive worker:",
      worker.id,
      "exit code:",
      code,
      " signal=",
      signal
    );
  });
} else {
  http
    .createServer((req, res) => {
      process.send({ pid: process.pid });
      res.end("hi cluster");
    })
    .listen(8000);
  console.log(`工作进程 ${process.pid} 已启动`);
  process.on("message", msg => {
    console.log("worker process id:", process.pid, "msg=", msg);
  });
}
