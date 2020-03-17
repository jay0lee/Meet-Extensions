function ab2str(buf) {
  return String.fromCharCode.apply(null, new Int8Array(buf));
}

function base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

var skip_headers = ["Cookie", "User-Agent", "Origin", "Sec-Fetch-Site",
                    "Sec-Fetch-Mode", "Sec-Fetch-Dest", "Referer",
                    "Accept-Encoding"];

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('request received:');
    console.log(request);
      var xrequest = new XMLHttpRequest();
      xrequest.withCredentials = true;
      xrequest.open("POST", request.url+'?', true); // append ? to avoid our webRequests
      for (i = 0; i < request.headers.length; i++) {
          if (! skip_headers.includes(request.headers[i].name)) {
            xrequest.setRequestHeader(request.headers[i].name, request.headers[i].value);
          }
      }
      xrequest.onerror = function () {
          console.log("** An error occurred during the transaction");
          console.log(this);
      };
      xrequest.onload = function(e) {
        console.log('sending response: ' + this.responseText);
        sendResponse({body: this.responseText});
        };
      var request_body = base64ToArrayBuffer(request.reqbody);
      xrequest.send(request_body);
      got_response = true;
      return true;
});
