var device_id_re = /@spaces\/.*\/devices\/([a-f,0-9,-]*)/;
var allowed_device_ids = [];
var whitelist_next_device = false;


function ab2str(buf) {
  return String.fromCharCode.apply(null, new Int8Array(buf));
}


chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    var post_binary = info.requestBody.raw[0].bytes;
    var post_form = ab2str(post_binary);
    var result = post_form.match(device_id_re);
    if ( ! result ) {
      console.log('no device id on UpdateMeetingDevice');
    }
    var device_id = result[1];
    if ( whitelist_next_device ) {
      console.log('Whitelisting first device id after CreateMeetingDevice: ' + device_id);
      allowed_device_ids.push(device_id);
      whitelist_next_device = false;
    }
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
      console.log('Ignoring CreatingMeetingDEvice call from ' + info.referer);
      return {cancel: false};
    }
    console.log('CreateMeetingDevice called, whitelisting next UpdateMeetingDevice')
    whitelist_next_device = true;
    return {cancel: false};
  },
  // filters
  {
    urls: [
      "https://meet.google.com/$rpc/google.rtc.meetings.v1.MeetingDeviceService/CreateMeetingDevice"
    ],
    types: ["xmlhttprequest"]
  },
  ["requestBody"]);
  
