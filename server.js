var http = require("http");
var fs = require("fs");

http
  .createServer(function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.headers.accept && req.headers.accept == "text/event-stream") {
      if (req.url == "/events") {
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

  var id = new Date().toLocaleTimeString();

  // Sends a SSE every 5 seconds on a single connection.
  const interval = setInterval(function() {
    const data = getRandomString();
    console.log("sending server side event", data);
    constructSSE(res, id, data);
  }, 1200);

  // stop streaming events after 10 seconds
  setTimeout(() => clearInterval(interval), 10000);
}

function constructSSE(res, id, data) {
  // res.write("id: " + id + "\n");
  res.write("data: " + data + "\n\n");
}

function getRandomString() {
  return Math.random()
    .toString(36)
    .substring(7);
}
