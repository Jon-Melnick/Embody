'use strict'


document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelector('#update').addEventListener('click', setTimer);
  document.querySelector('#off').addEventListener('click', disable);
});

let time = function(){
  return parseInt(document.querySelector('#time').value);
};

let notificationStyle = function(){
  let results = [];
  let options = document.getElementsByClassName('checkbox');
  for (let i = 0; i < options.length; i++) {
    if (options[i].checked){
      results.push(options[i].value);
    }
  }
  return results
};


let setTimer = function(e){
  e.preventDefault();
  e.currentTarget.textContent = 'Reset Timer';
  chrome.extension.sendMessage({action: 'countdown',
                                time: time(),
                                notifStyle: notificationStyle()
                                });
};

let disable = function(e){
  e.preventDefault();
  chrome.extension.sendMessage({action: 'disable'});
};
