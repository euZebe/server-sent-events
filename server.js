var http = require("http");

http
  .createServer(function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.headers.accept && req.headers.accept === "text/event-stream") {
      if (req.url === "/events") {
        console.log("receiving request on /events");
        sendSSE(req, res);
      } else {
        res.writeHead(404);
        res.end();
      }
    }
  })
  .listen(8100, () => {
    console.log("server started on port 8100");
  });

function sendSSE(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });

  // Sends a SSE every second on a single connection.
  const interval = setInterval(function() {
    const data = getRandomString();
    constructSSE(res, data);
  }, 500);

  // stop streaming events after x seconds
  setTimeout(() => {
    constructSSE(res, "end");
  }, 2000);

  req.on("close", () => {
    console.log("The client unsubscribed => stop sending requests");
    clearInterval(interval);
    res.end();
  });
}

function constructSSE(res, data) {
  console.log("sending server side event", data);
  res.write("data: " + data + "\n\n");
}

function getRandomString() {
  return Math.random()
    .toString(36)
    .substring(7);
}
