function mute_all() {
  chrome.runtime.sendMessage({command: "muteAll"}, function(response) {
  console.log(response);
}); 
}

function kick_all() {
  chrome.runtime.sendMessage({command: "kickAll"}, function(response) {
  console.log(response);
});
}

document.getElementById('muteall').addEventListener('click', mute_all);
document.getElementById('kickall').addEventListener('click', kick_all);
