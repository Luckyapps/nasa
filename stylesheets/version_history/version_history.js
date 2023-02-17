var watermark, flyin_state, body, version_history_container,version_history_grid_container, version_history_close_button, version_history_info_button, version_history_innerHTML, flyin, version_history_info_content;

async function load_version_history_stylesheet(){
  if(luckyapp_core.modules.updates.loaded){
    var html_content = '<div><!--Version_History and Watermark--><div title="Versionsinformation" id="watermark">App by <a href="">Luckyapps</a></div><div id="version_history_grid_container"><div id="version_history_container" class="version_history_closed_FIRST"><h2>Versionen:</h2><div id="version_history_toolbar"><div style="cursor:help" id="version_history_info_open">?</div><div id="version_history_close">X</div></div></div></div></div>'
    html_content = await createHTML(html_content);
    await document.body.appendChild(html_content);

    watermark = document.getElementById("watermark");
    if(luckyapp_core.page_config.modules.version_history.watermark == false){
      watermark.classList.add("invisible");
    }
    version_history_close_button = document.getElementById("version_history_close");
    version_history_container = document.getElementById("version_history_container");
    version_history_grid_container = document.getElementById("version_history_grid_container");
    version_history_info_button = document.getElementById("version_history_info_open");
    body = document.getElementsByTagName("body")[0];

    watermark.addEventListener("click", version_history_open);
    version_history_close_button.addEventListener("click", version_history_close);
    version_history_info_button.addEventListener("click", version_history_info_open);
    //Experimentell
    watermark.addEventListener("mousedown", watermark_mousedown);
    watermark.addEventListener("mouseup", watermark_mouseup);
    watermark.addEventListener("touchstart", watermark_mousedown);

    var vers_hist_cont = await load_version_history_updatelist();
    version_history_container.innerHTML += vers_hist_cont;
    
    version_history_innerHTML = version_history_container.innerHTML;

    luckyapp_core.modules.version_history.loaded = true;
  }else{
    await sleep(1);
    load_version_history_stylesheet();
  }
}

function add_window_eventlistener(){
  window.addEventListener('click', window_clicked)   
}

function window_clicked(e){
  if (version_history_container.contains(e.target)){
      // Clicked in box
    } else{
      // Clicked outside the box
      if(watermark.contains(e.target) != true /*&& titlebar.contains(e.target) != true && settings.contains(e.target) != true*/){ //Ausnahme (Watermark, titlebar, settings)
        if(version_history_container.classList.contains("version_history_opened")){ 
            version_history_close();
        }
      }
    }
}

window.addEventListener('popstate', (event) => {
  //console.log(`location: ${document.location}, state: ${JSON.stringify(event.state)}`);
  if(flyin_state == "open"){
      flyin_close();
      window.history.forward(1);
  }
});

function flyin_open(content, type){ //Öffnen eines Flyin-Fensters: flyin_open([content]) --> [content] muss html als String sein
  flyin = true;
  if(version_history_container.classList.contains("version_history_opened")){//Experimentell: Wenn schon geöffnet
    flyin_close("flyin", content, type, "newflyin");
  }else{
    if(type == "info"){
      version_history_container.innerHTML = content +"<div id='version_history_toolbar'><div id='version_history_close'>X</div></div>"; //Experimentell
      version_history_close_button = document.getElementById("version_history_close"); //Experimentell: muss neu definiert werden 
      version_history_info_button = document.getElementById("version_history_info_open"); //Experimentell: muss neu definiert werden
      version_history_close_button.addEventListener("click", version_history_open); //Experimentell: muss neu definiert werden
    }else{
      version_history_container.innerHTML = content +"<div id='version_history_toolbar'><!--<div style='cursor:not-allowed' id='version_history_info_open'>?</div>--><div id='version_history_close'>X</div></div>"; //Experimentell
      version_history_close_button = document.getElementById("version_history_close"); //Experimentell: muss neu definiert werden 
      version_history_info_button = document.getElementById("version_history_info_open"); //Experimentell: muss neu definiert werden
      version_history_close_button.addEventListener("click", version_history_close); //Experimentell: muss neu definiert werden
      //version_history_info_button.addEventListener("click", version_history_info_open); //Experimentell: muss neu definiert werden
    }
    history.pushState({ page: 1 }, "title 1", "?flyin");
    flyin_state = "open";
    version_history_grid_container.style.display = "grid";
    version_history_grid_container.classList = "version_history_grid_container_open";
    body.style.overflow = "hidden";
    version_history_container.classList = "";
    version_history_container.classList.add("version_history_opened");

    var timeout_duration = parseFloat(window.getComputedStyle(version_history_container).animationDuration) * 1000;
    setTimeout(function() {
      version_history_grid_container.style.overflow = "auto";
      add_window_eventlistener();
    }, timeout_duration); 
  } 
}

function flyin_close(origin, content, type, reason){
  history.back();
  flyin_state = "close";
  body.style.overflow = "unset";
  version_history_grid_container.style.overflow = "hidden";
  version_history_grid_container.classList = "version_history_grid_container_close";
  version_history_container.classList = "";
  version_history_container.classList.add("version_history_closed");

  var timeout_duration = parseFloat(window.getComputedStyle(version_history_container).animationDuration) * 1000;
  setTimeout(function() {
    version_history_grid_container.style.display = "none";
    if(origin == "version_history"){
      version_history_open();
    }else if(reason == "newflyin"){
      flyin_open(content, type);
    }
  }, timeout_duration);
  window.removeEventListener("click", window_clicked);
}

function version_history_open(evt){
  add_window_eventlistener();
    if((version_history_container.classList.contains("version_history_opened") && evt.target.id != "watermark") || flyin){//Experimentell: Wenn schon geöffnet
      flyin = false;
      flyin_close("version_history");
    }else{
      version_history_container.innerHTML = version_history_innerHTML; //Experimentell
      version_history_close_button = document.getElementById("version_history_close"); //Experimentell: muss neu definiert werden 
      version_history_info_button = document.getElementById("version_history_info_open"); //Experimentell: muss neu definiert werden
      version_history_close_button.addEventListener("click", version_history_close); //Experimentell: muss neu definiert werden
      version_history_info_button.addEventListener("click", version_history_info_open); //Experimentell: muss neu definiert werden
      version_history_grid_container.style.display = "grid";
      version_history_grid_container.classList = "version_history_grid_container_open";
      body.style.overflow = "hidden";
      version_history_container.classList = "";
      version_history_container.classList.add("version_history_opened");

      var timeout_duration = parseFloat(window.getComputedStyle(version_history_container).animationDuration) * 1000;
      setTimeout(function() {
        version_history_grid_container.style.overflow = "auto";
      }, timeout_duration); 
    }
}

function version_history_close(){
  flyin = false;
    body.style.overflow = "unset";
    version_history_grid_container.style.overflow = "hidden";
    version_history_grid_container.classList = "version_history_grid_container_close";
    version_history_container.classList = "";
    version_history_container.classList.add("version_history_closed");

    var timeout_duration = parseFloat(window.getComputedStyle(version_history_container).animationDuration) * 1000;
    setTimeout(function() {
      version_history_grid_container.style.display = "none";
    }, timeout_duration); 
    window.removeEventListener("click", window_clicked);
}

function version_history_info_open(){
  console.log("[version_history_info_open()] Funktion aktuell nicht verfügbar.");
  version_history_info_content = document.getElementById("vers-hist-info-cont").innerHTML;
  setTimeout(function() { // Wegen kollision mit eventlistener clicked outside box
    flyin_open(version_history_info_content, "info");
  }, 1);
}

function version_history_info_close(){
  version_history_open();
}

//Experimentell
function watermark_mousedown(){
  watermark.classList= "watermark_mousedown";
}

function watermark_mouseup(){
  watermark.classList = "watermark_mouseup";
}