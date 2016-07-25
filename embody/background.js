
let timer = false;
let time = 60;
let notifStyle = ['modal'];
let deskNotif;

countdown = function (inTime, inNotifStyle) {
  clearTimeout(timer);
  time = inTime || time;
  notifStyle = inNotifStyle || notifStyle;
  timer = setTimeout(()=>{
    bell();
    for (let i = 0; i < notifStyle.length; i++) {
      if (notifStyle[i] === 'modal') {
        toContent("modal", false);
      } else if (notifStyle[i] === 'notification') {
        notification();
      };
    }
  }, time * 100)
};

// automatically starts a timer
countdown();

notification = function() {
  let options = {
        type: "image",
        title: "Embody",
        message: "",
        iconUrl: "icon.png",
        imageUrl: "notif.png",
        priority: 2
    };
    deskNotif = chrome.notifications.create("Embody", options, ()=>{});
    // chrome.notifications.onButtonClicked.addListener(handleNotifBtn);
};

chrome.extension.onMessage.addListener(
  function(req, sender, resp){
    if (req.action === 'countdown'){
      countdown(req.time, req.notifStyle);
      clearAll();
    } else if (req.action === 'mediTimer') {
      meditationTimer();
    } else if (req.action === 'disable') {
      disable();
    }
  });

disable = function(){
  if (timer) {
    clearTimeout(timer);
  }
  clearAll();
};

handleNotifBtn = function(){
  toContent("clear", false);
  toContent("modal", false);
  countdown(time, notifStyle);
};

toContent = function(action, variable){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
     chrome.tabs.sendMessage(tabs[0].id, {action: action, variable: variable}, function(response) {});
  });
};

let beginTime, endTime;
let medTimeLeft = 180000;
let medInterval = false;
let medTime = false;

meditationTimer = function(){
  medTimeLeft = 179000;
  medInterval = setInterval(() => {
    timeTick(medTimeLeft);
    if (medTimeLeft <= 0) {
      clearInterval(medInterval);
    }
  }, 1000);

  medTime = setTimeout(()=>{
    toContent("timesUp", false)
    bell();
    clearTimeout(medTime);
  }, 180000);
}

timeTick = function(time){
  let min = Math.floor(time / 60000);
  let seconds = Math.floor((time % 60000) / 1000);
  seconds = seconds > 9 ? seconds : '0' + seconds;
  let timeLeft = (min + ':' + seconds);
  toContent("time", timeLeft);
  medTimeLeft -= 1000;
};

clearAll = function(){
  if (medInterval || medTime) {
    clearInterval(medInterval);
    clearTimeout(medTime);
  }
  toContent("clear", false);
}

bell = function(){
  document.getElementById('bell').play();
}
