var watermark,body, info_container,info_background, info_container_close_button, info_container_info_button, info_container_innerHTML, flyin, info_container_info_content;

function load_info_container_stylesheet(){
    watermark = document.getElementById("watermark");
    info_container_close_button = document.getElementById("info_container_close");
    info_container = document.getElementById("info_container");
    info_background = document.getElementById("info_background");
    info_container_info_button = document.getElementById("info_container_info_open");
    body = document.getElementsByTagName("body")[0];

    info_container_innerHTML = info_container.innerHTML;

    watermark.addEventListener("click", info_container_open);
    info_container_close_button.addEventListener("click", info_container_close);
    info_container_info_button.addEventListener("click", info_container_info_open);
    //Experimentell
    watermark.addEventListener("mousedown", watermark_mousedown);
    watermark.addEventListener("mouseup", watermark_mouseup);
    watermark.addEventListener("touchstart", watermark_mousedown);
}

function add_window_eventlistener(){
  window.addEventListener('click', window_clicked)   
}

function window_clicked(e){
  if (info_container.contains(e.target)){
      // Clicked in box
    } else{
      // Clicked outside the box
      if(watermark.contains(e.target) != true){ //Ausnahme (Watermark, titlebar, settings)
        if(info_container.classList.contains("info_container_opened")){ 
            info_container_close();
        }
      }
    }
    console.log("WINDOW_CLICKED");
}

function flyin_open(content, type){ //Öffnen eines Flyin-Fensters: flyin_open([content]) --> [content] muss html als String sein
  flyin = true;
  if(info_container.classList.contains("info_container_opened")){//Experimentell: Wenn schon geöffnet
    flyin_close("flyin", content, type);
  }else{
    if(type == "info"){
      info_container.innerHTML = content +"<div id='info_container_toolbar'><div id='info_container_close'>X</div></div>"; //Experimentell
      info_container_close_button = document.getElementById("info_container_close"); //Experimentell: muss neu definiert werden 
      info_container_info_button = document.getElementById("info_container_info_open"); //Experimentell: muss neu definiert werden
      info_container_close_button.addEventListener("click", info_container_open); //Experimentell: muss neu definiert werden
    }else{
      info_container.innerHTML = content +"<div id='info_container_toolbar'><!--<div style='cursor:not-allowed' id='info_container_info_open'>?</div>--><div id='info_container_close'>X</div></div>"; //Experimentell
      info_container_close_button = document.getElementById("info_container_close"); //Experimentell: muss neu definiert werden 
      info_container_info_button = document.getElementById("info_container_info_open"); //Experimentell: muss neu definiert werden
      info_container_close_button.addEventListener("click", info_container_close); //Experimentell: muss neu definiert werden
      //info_container_info_button.addEventListener("click", info_container_info_open); //Experimentell: muss neu definiert werden
    }
    info_background.style.display = "grid";
    body.style.overflow = "hidden";
    info_container.classList = "";
    info_container.classList.add("info_container_opened");

    var timeout_duration = parseFloat(window.getComputedStyle(info_container).animationDuration) * 1000;
    setTimeout(function() {
      info_background.style.overflow = "auto";
      add_window_eventlistener();
    }, timeout_duration); 
  } 
}

function flyin_close(origin, content, type){
  body.style.overflow = "unset";
  info_background.style.overflow = "hidden";
  info_container.classList = "";
  info_container.classList.add("info_container_closed");

  var timeout_duration = parseFloat(window.getComputedStyle(info_container).animationDuration) * 1000;
  setTimeout(function() {
    info_background.style.display = "none";
    if(origin == "info_container"){
      info_container_open();
    }else{
      flyin_open(content, type);
    }
  }, timeout_duration);
  window.removeEventListener("click", window_clicked);
}

function info_container_open(evt){
  add_window_eventlistener();
    if((info_container.classList.contains("info_container_opened") && evt.target.id != "watermark") || flyin){//Experimentell: Wenn schon geöffnet
      flyin = false;
      flyin_close("info_container");
    }else{
      info_container.innerHTML = info_container_innerHTML; //Experimentell
      info_container_close_button = document.getElementById("info_container_close"); //Experimentell: muss neu definiert werden 
      info_container_info_button = document.getElementById("info_container_info_open"); //Experimentell: muss neu definiert werden
      info_container_close_button.addEventListener("click", info_container_close); //Experimentell: muss neu definiert werden
      info_container_info_button.addEventListener("click", info_container_info_open); //Experimentell: muss neu definiert werden
      info_background.style.display = "grid";
      body.style.overflow = "hidden";
      info_container.classList = "";
      info_container.classList.add("info_container_opened");

      var timeout_duration = parseFloat(window.getComputedStyle(info_container).animationDuration) * 1000;
      setTimeout(function() {
        info_background.style.overflow = "auto";
      }, timeout_duration); 
    }
}

function info_container_close(){
  console.log("close");
  flyin = false;
    body.style.overflow = "unset";
    info_background.style.overflow = "hidden";
    info_container.classList = "";
    info_container.classList.add("info_container_closed");

    var timeout_duration = parseFloat(window.getComputedStyle(info_container).animationDuration) * 1000;
    setTimeout(function() {
      info_background.style.display = "none";
    }, timeout_duration); 
    window.removeEventListener("click", window_clicked);
}

function info_container_info_open(){
  console.log("[info_container_info_open()] Funktion aktuell nicht verfügbar.");
  info_container_info_content = document.getElementById("vers-hist-info-cont").innerHTML;
  setTimeout(function() { // Wegen kollision mit eventlistener clicked outside box
    flyin_open(info_container_info_content, "info");
  }, 1);
}

function info_container_info_close(){
  info_container_open();
}

//Experimentell
function watermark_mousedown(){
  watermark.classList= "watermark_mousedown";
}

function watermark_mouseup(){
  watermark.classList = "watermark_mouseup";
}