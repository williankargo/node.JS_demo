var http = require("http"); // http是node自帶的模組
var url = require("url");

function start(route, handle) {
  function onRequest(request, response) { // 從這裡接收值
    var pathname = url.parse(request.url).pathname;
    var postData = "";
    // 為了使整個過程Non-Blocking，Node.js會將POST資料拆分成很多小的資料區塊，然後透過觸發特定的事件，將這些小資料區塊傳遞給回呼(callback)函數。這裡的特定的事件有data事件（表示新的小資料區塊到達了）以及end事件（表示所有的資料都已經接收完畢）
    request.setEncoding("utf8");

    request.addListener("data", function (postDataChunk) {
      postData += postDataChunk;
      console.log("Received POST data chunk '" +
        postDataChunk + "'.");
    });

    request.addListener("end", function () {
      route(handle, pathname, response, postData);
    });

    // route(handle, pathname, response, request);
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start; // 匯出此模組