function mute_all() {
  chrome.runtime.sendMessage({command: "mute_all"}, function(response) {
  console.log(response);
}); 
}

document.getElementById('muteall').addEventListener('click', mute_all);