var device_id_re = /@spaces\/.*\/devices\/([a-f,0-9,-]*)/;
var allowed_device_ids = [];
var create_device_body;
var create_device_response;

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Int8Array(buf));
}

function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    var post_binary = info.requestBody.raw[0].bytes;
    var post_form = ab2str(post_binary);
    var result = post_form.match(device_id_re);
    if ( ! result ) {
      console.log('no device id on UpdateMeetingDevice, doing nothing');
      return {cancel: false};
    }
    var device_id = result[1];
    if (allowed_device_ids.indexOf(device_id) > -1) {
        console.log('Client is updating whitelisted device: ' + device_id);
        return {cancel: false};
    } else {
        console.log('Refusing update to non-whitelisted client: ' + device_id);
        return {cancel: true};
    }
  },
  // filters
  {
    urls: [
      "https://meet.google.com/$rpc/google.rtc.meetings.v1.MeetingDeviceService/UpdateMeetingDevice",
    ],
    types: ["xmlhttprequest"]
  },
  ["requestBody", "blocking"]);


chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    if ( info.initiator != 'https://meet.google.com') {
      console.log('Ignoring CreatingMeetingDevice call from ' + info.initiator);
      return {cancel: false};
    }
    create_device_body = info.requestBody.raw[0].bytes;
    return true;
  },
  // filters
  {
    urls: [
      "https://meet.google.com/$rpc/google.rtc.meetings.v1.MeetingDeviceService/CreateMeetingDevice"
    ],
    types: ["xmlhttprequest"]
  },
  ["requestBody", "extraHeaders"]);
  
chrome.webRequest.onSendHeaders.addListener(
  function(info) {
    if ( info.initiator != 'https://meet.google.com') {
      console.log('Ignoring CreatingMeetingDevice call from ' + info.initiator);
      return {cancel: false};
    }
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        reqbody = _arrayBufferToBase64(create_device_body);
        chrome.tabs.sendMessage(tabs[0].id, {url: info.url, reqbody: reqbody, headers: info.requestHeaders}, function(mresponse) {
          create_device_response = mresponse.body;
          create_decoded = atob(create_device_response);
          var result = create_decoded.match(device_id_re);
          if ( ! result ) {
            console.log('no device id on CreatMeetingDevice, doing nothing');
          } else {
            var device_id = result[1];
            allowed_device_ids.push(device_id);
            console.log('whitelisted created device_id: ' + device_id);
            
          }
        });
      });
  },
  // filters
  {
    urls: [
      "https://meet.google.com/$rpc/google.rtc.meetings.v1.MeetingDeviceService/CreateMeetingDevice"
    ],
    types: ["xmlhttprequest"]
  },
  ["requestHeaders", "extraHeaders"]);
  
  
