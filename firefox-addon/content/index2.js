/*
On startup, connect to the "ping_pong" app.
*/
console.log("starting up")
var port = browser.runtime.connectNative("privacy_plugin");
console.log("port open")
/*
Listen for messages from the app.
*/
port.onMessage.addListener((response) => {
  console.log("Received: " + response);
});

/*
On a click on the browser action, send the app a message.
*/
browser.browserAction.onClicked.addListener(() => {
  console.log("Sending:  ping");
  port.postMessage("ping");
});
/*
var button = document.getElementById("test");
button.addEventListener("click", testAction);

function testAction(e) {
	console.log("test button clicked")
	console.log("Sending:  ping");
  	port.postMessage("ping");
}
*/