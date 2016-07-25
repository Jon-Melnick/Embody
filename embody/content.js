chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === "modal"){
          makeModal();
        } else if (request.action === "timesUp") {
          timesUp();
          enableBtns();
        } else if (request.action === 'time') {
          updateTimer(request.variable)
        } else if (request.action === 'clear') {
          clearAll();
        }
    });

function makeModal(){
  bg = document.createElement("div");
  bg.id = 'embody-bg'
  bg.setAttribute("style","position: fixed; left: 0px; top: 0px; background-image: url('https://66.media.tumblr.com/1cc87632762c63e92a8da5ddcb214ed9/tumblr_mxazopJdFB1qckf7no10_1280.jpg'); background-size: cover; background-repeat: none; opacity: 0; z-index: 2000; height: 100%; width: 100%; transition: opacity 3s ease-in-out;");

  // iframeElement = document.createElement("iframe");
  // iframeElement.setAttribute("style","width: 100%; height: 100%;");
  //
  // bg.appendChild(iframeElement);

  fg = document.createElement("div");
  fg.id = 'embody-fg'
  fg.setAttribute("style","position: fixed; width: 40%; min-width: 30%; background-image: url('https://res.cloudinary.com/arkean/image/upload/a_180/v1469411690/bg2_zure55.jpg'); background-size: cover; border: 2px solid white; color: white; opacity: 0; padding: 10px; background-color: rgb(255, 255, 255); z-index: 2001; overflow: auto; text-align: center; top: 20%; left: 30%;  transition: opacity 3s ease-in-out;");

  header = document.createElement('h1');
  header.setAttribute("style", "font-size: 50px; margin: 20px;")
  header.innerText = 'Embody'
  fg.appendChild(header)

  text = document.createElement('p');
  text.setAttribute("style", "font-size: 20px; padding: 20px; line-height: 25px; margin: 10px; color: white;")
  text.id = 'embody-fg-text'
  text.innerText = "Time to take a break! Please take a few minutes to stretch and walk without electronic distractions. When you are ready to meditate, hit start, close your eyes, and direct your awareness to your body. Notice your breathing and how you feel physically and emotionally. Once the three minute meditation is complete you will hear a bell."
  fg.appendChild(text);

  let btnStart = makeBtn('Start');
  btnStart.onclick = function(){
    text.setAttribute("style", "font-size: 60px; padding: 20px; line-height: 25px; margin: 10px; color: white;")
    text.innerText = '3:00';
    toBackground('mediTimer', false);
    fg.removeChild(btnStart)
    disableBtns(fg);
  }
  fg.appendChild(btnStart)

  let btnRestart = makeBtn("Finish");
  btnRestart.onclick = function(){
    chrome.extension.sendMessage({action: 'countdown'});
    transition(bg, .8, 0, false);
    transition(fg, 1, 0, false);
    removeElements(fg, bg);
    disableBtns(fg);
  }
  fg.appendChild(btnRestart)


  let btnOff = makeBtn("Turn Off");
  btnOff.onclick = function(){
    transition(bg, .8, 0, false);
    transition(fg, 1, 0, false);
    removeElements(fg, bg);
    disableBtns(fg);
  }
  fg.appendChild(btnOff)

  document.body.appendChild(bg);
  document.body.appendChild(fg);
  transition(bg, 0, .9, true);
  transition(fg, 0, 1, true);
}

toBackground = function(action, variable){
  chrome.extension.sendMessage({action: action, variable: variable});
};

function transition (element, start, end, fadeIn){
  let opacity = start;
  let fade = setInterval(()=>{
    if (fadeIn) {
      opacity += .1;
    } else {
      opacity -= .1;
    }
    element.style.opacity = opacity;
    if (element.style.opacity == end) {
      clearInterval(fade);
    }
  }, 0)
};

function timesUp(){
  let text = document.getElementById('embody-fg-text');
  text.setAttribute("style", "font-size: 20px; padding: 10px; line-height: 25px; margin: 10px; color: white;")
  text.innerText = 'Thank you for taking the time to rest your mind and body!'
};

function updateTimer(currentTimeLeft){
  let text = document.getElementById('embody-fg-text');
  text.innerText = currentTimeLeft;
};

function removeElements(fg, bg) {
  setTimeout(()=>{
    document.body.removeChild(fg);
    document.body.removeChild(bg);}, 3000);
}

function makeBtn(text){
  let btn = document.createElement('button');
  btn.className = 'embody-btn'
  btn.innerText = text;
  btn.setAttribute("style", "display: inline-block; padding: 10px; position: relative; margin: 20px 30px 30px 30px; padding: 0 20px; text-align: center; text-decoration: none; font: bold 12px/25px Arial, sans-serif; font-size: 20px; text-shadow: 1px 1px 1px rgba(255,255,255, .22); -webkit-border-radius: 30px; -moz-border-radius: 30px; border-radius: 30px; -webkit-box-shadow: 1px 1px 1px rgba(0,0,0, .29), inset 1px 1px 1px rgba(255,255,255, .44); -moz-box-shadow: 1px 1px 1px rgba(0,0,0, .29), inset 1px 1px 1px rgba(255,255,255, .44); box-shadow: 1px 1px 1px rgba(0,0,0, .29), inset 1px 1px 1px rgba(255,255,255, .44); -webkit-transition: all 0.15s ease; -moz-transition: all 0.15s ease; -o-transition: all 0.15s ease; -ms-transition: all 0.15s ease; transition: all 0.15s ease; color: #000000; background: #fff; background: -moz-linear-gradient(top,  #fff 0%, #39a0be 60%); background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#fff), color-stop(60%,#39a0be)); background: -o-linear-gradient(top,  #fff 0%,#39a0be 60%); background: -ms-linear-gradient(top,  #fff 0%,#39a0be 60%); background: linear-gradient(top,  #fff 0%,#39a0be 60%);")
  return btn;
}

function disableBtns(fg) {
  let btns = document.getElementsByClassName('embody-btn');
  for (let i = 0; i < btns.length; i++) {
    btns[i].style.display = 'none';
  }
}

function enableBtns() {
  let btns = document.getElementsByClassName('embody-btn');
  for (let i = 0; i < btns.length; i++) {
    btns[i].style.display = 'inline-block';
  }
}

function clearAll(){
  if (document.getElementById('embody-bg')) {
    let bg = document.getElementById('embody-bg');
    let fg = document.getElementById('embody-fg');
    document.body.removeChild(bg);
    document.body.removeChild(fg);
  }
}
