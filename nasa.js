var eingabe, ausgabe, data_raw, data_temp, key, ident=0, data_img, next_page, global_data;

function load_nasa(){ // Nasa Laden
  eingabe = document.getElementById("eingabe");
  ausgabe = document.getElementById("ausgabe");
  window.addEventListener("keydown", keytest);
  sessionStorage.clear();
}

function keytest(evt){ // Tastentest
  key = evt.key;
  if(key == "Enter"){
    init_nasa();
  }
}

function init_nasa(){ // Nasa Initiieren
  get_nasa(eingabe.value);
}

function init_nasa_nextPage(){
  start_nasa_nextPage();
}

function get_nasa(suche){ // Daten holen
  var requestURL = "https://images-api.nasa.gov/search?q="+ suche;
  var request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();
  request.onload = function() {
    data_raw = request.response;
    start_nasa(data_raw);
  }
}

function get_add(adress){
  return new Promise(resolve => {
  if(adress.search("https") == -1){
    adress = adress.replace("http", "https");
  }
  var requestURL = adress;
  var request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();
  request.onload = function() {
    var data_temp2 = request.response;
    resolve(data_temp2);
  }
});
}

async function data_get(adress){
   data_temp = await get_add(adress);
   return data_temp;
}

function ausgabe_add(wert){
  ausgabe.innerHTML = ausgabe.innerHTML + wert;
}

function ausgabe_img_add(wert){
  document.getElementById("ausgabe_img").innerHTML = document.getElementById("ausgabe_img").innerHTML + wert;
}

function info_container_add(wert, element, mode){
  if(element){
    if(mode){
      if(mode == "add"){
        document.getElementById(element).innerHTML = document.getElementById(element).innerHTML + wert;
      }
      mode = undefined;
    }else{
      document.getElementById(element).innerHTML = wert;
      console.log("contaiener add to element");
      element = undefined;
    }
    
  }else{
    info_container.innerHTML = info_container.innerHTML + wert;
  }
}

function element_remove(element){
  document.getElementById(element).remove();
}

function start_nasa(data){
  sessionStorage.clear();
  ident = 0;
  console.log(data);
  ausgabe.innerHTML = "";
  nasa_show_info(data);
  for(i=0; i<data.collection.items.length; i++){
    ident = ident + 1;
    sessionStorage.setItem(ident, JSON.stringify(data.collection.items[i])); // daten mit mit identifier speichern
    if(data.collection.items[i].data[0].media_type == "image"){
      ausgabe_img_add("<img class='picture' onclick='info_open_img(this)' id='"+ ident +"' src='"+ data.collection.items[i].links[0].href +"'></img>");
    }else if(data.collection.items[i].data[0].media_type == "video"){
      ausgabe_img_add("<img class='picture video' onclick='info_open_video(this)' id='"+ ident +"' src='"+ data.collection.items[i].links[0].href +"'></img>");
    }
    if(i == data.collection.items.length - 1 && data.collection.links[0].rel == "next"){
      next_page = data.collection.links[0].href;
      ausgabe_add("<button id='next_page' onclick='init_nasa_nextPage()'>Nächste Seite laden</button>");
    }
  }
}

async function start_nasa_nextPage(){
  element_remove("next_page");
  await data_get(next_page);
  var data = data_temp;
  console.log(data);
  for(i=0; i<data.collection.items.length; i++){
    ident = ident + 1;
    sessionStorage.setItem(ident, JSON.stringify(data.collection.items[i])); // daten mit mit identifier speichern
    if(data.collection.items[i].data[0].media_type == "image"){
      ausgabe_img_add("<img class='picture' onclick='info_open_img(this)' id='"+ ident +"' src='"+ data.collection.items[i].links[0].href +"'></img>");
    }else if(data.collection.items[i].data[0].media_type == "video"){
      ausgabe_img_add("<img class='picture video' onclick='info_open_video(this)' id='"+ ident +"' src='"+ data.collection.items[i].links[0].href +"'></img>");
    }
    if(i == data.collection.items.length - 1 && (data.collection.links[0].rel == "next" || data.collection.links[1].rel == "next")){
      next_page = data.collection.links[1].href;
      ausgabe_add("<button id='next_page' onclick='init_nasa_nextPage()'>Nächste Seite laden</button>");
    }
  }
}

function nasa_show_info(data){
  if(data.collection.metadata.total_hits > 0){
    ausgabe_add("Treffer insgesammt: "+ data.collection.metadata.total_hits +" | Seiten: "+ Math.ceil(data.collection.metadata.total_hits/100));
  }else{
    ausgabe_add("Keine Ergebnisse gefunden.")
  }
  ausgabe_add("<hr style='width:15%'><div id='ausgabe_img'></div>");
}

async function info_open_img(img){
  var data_img = JSON.parse(sessionStorage.getItem(img.id));
  var data;
  //info_container.innerHTML = "<div id='info_container_close'>X</div>"; 
  info_container.innerHTML = "<div id='info_container_toolbar'><div style='cursor:help' id='info_container_info_open'></div><div id='info_container_close'>X</div></div>"; 
  info_container_add("<h1>"+ data_img.data[0].title +"</h1><img class='info_container_img' src="+ data_img.links[0].href +"></img><p>"+ data_img.data[0].description +"</p><hr><h2>Daten</h2><table><tbody><tr><th>Nasa Id</th><td>"+ data_img.data[0].nasa_id +"</td></tr><tr><th>Aufnahmedatum</th><td>"+ data_img.data[0].date_created +"</td></tr><tr><th>Ort</th><td>"+ data_img.data[0].location +"</td></tr><tr><th>Fotograf</th><td>"+ data_img.data[0].photographer +"</td></tr><tr><th>Nasa Center</th><td>"+ data_img.data[0].center +"</td></tr></tbody></table><hr><h2>Links zu diesem Element:</h2><ul id='linklist'></ul>");
  //info_background.style.display = "block";
  //body.style.overflow = "hidden";
  await data_get(data_img.href);
  //console.log(data_img);
  data = data_temp;
  for(i=0; i<data.length; i++){
    if(data[i].substr(-9) == "large.jpg"){
      //console.log(data[i]);
      //info_container_add("<li><a href='"+ data[i] +"'>Bild: "+ data[i] +"</a></li>", "linklist", "add");
      info_container_add("<li><a href='"+ data[i] +"'>großes Bild</a></li>", "linklist", "add");
      //info_container_add("<img src='"+ data[i] +"'></img>");
    }else if(data[i].substr(-10) == "medium.jpg"){
      info_container_add("<li><a href='"+ data[i] +"' target='_blank'>mittleres Bild</a></li>", "linklist", "add");
    }else if(data[i].substr(-8) == "orig.tif"){
      info_container_add("<li><a href='"+ data[i] +"' target='_blank'>original Bild</a></li>", "linklist", "add");
    }else if(data[i].substr(-9) == "small.jpg"){
      info_container_add("<li><a href='"+ data[i] +"' target='_blank'>kleines Bild</a></li>", "linklist", "add");
    }else if(data[i].substr(-9) == "thumb.jpg"){
      info_container_add("<li><a href='"+ data[i] +"' target='_blank'>thumb Bild</a></li>", "linklist", "add");
    }else if(data[i].substr(-13) == "metadata.json"){
      info_container_add("<li><a href='"+ data[i] +"' target='_blank'>Metadaten</a></li>", "linklist", "add");
    }else{
      //console.log("KEIN BILD: "+ data[i]);
      info_container_add("<li><a href='"+ data[i] +"' target='_blank'>"+ data[i] +"</a></li>", "linklist", "add");
    }
    info_container_add("<hr>", "linklist", "add");
  }
  global_data = data_img;
  info_container_add("<li><a href='#' onclick='open_additional_data();'>Zusätzliche Daten in Konsole anzeigen</a></li>", "linklist", "add");

  //document.getElementById("info_container_close").addEventListener("click", info_close);
  //info_resize();
  prepare_info_container();
}

async function info_open_video(vid){
  var data_vid = JSON.parse(sessionStorage.getItem(vid.id));
  //console.log(data_vid);
  var data;
  info_container.innerHTML = "<div id='info_container_toolbar'><div style='cursor:help' id='info_container_info_open'></div><div id='info_container_close'>X</div></div>"; 
  /*info_background.style.display = "block";
  body.style.overflow = "hidden";*/

  info_container_add("<h1>"+ data_vid.data[0].title +"</h1><div id='video'></div><p>"+ data_vid.data[0].description +"</p><hr><h2>Daten</h2><table><tbody><tr><th>Nasa Id</th><td>"+ data_vid.data[0].nasa_id +"</td></tr><tr><th>Aufnahmedatum</th><td>"+ data_vid.data[0].date_created +"</td></tr><tr><th>Ort</th><td>"+ data_vid.data[0].location +"</td></tr><tr><th>Fotograf</th><td>"+ data_vid.data[0].photographer +"</td></tr><tr><th>Nasa Center</th><td>"+ data_vid.data[0].center +"</td></tr></tbody></table><hr><h2>Links zu diesem Element:</h2><ul id='linklist'></ul>");
  await data_get(data_vid.href);
  //console.log(data_vid);
  data = data_temp;
  for(i=0; i<data.length; i++){
    if(data[i].substr(-11) == "preview.mp4"){
      //console.log(data[i]);
      info_container_add("<video class='info_container_img' src="+ data[i].replace(/ /g,"%20") +" controls></video>", "video", "add");
    }/*else if(data[i].substr(-10) == "medium.jpg"){
      info_container_add("<li><a href='"+ data[i] +"' target='_blank'>mittleres Bild</a></li>", "linklist", "add");
    }else if(data[i].substr(-8) == "orig.tif"){
      info_container_add("<li><a href='"+ data[i] +"' target='_blank'>original Bild</a></li>", "linklist", "add");
    }else if(data[i].substr(-9) == "small.jpg"){
      info_container_add("<li><a href='"+ data[i] +"' target='_blank'>kleines Bild</a></li>", "linklist", "add");
    }else if(data[i].substr(-9) == "thumb.jpg"){
      info_container_add("<li><a href='"+ data[i] +"' target='_blank'>thumb Bild</a></li>", "linklist", "add");
    }else if(data[i].substr(-13) == "metadata.json"){
      info_container_add("<li><a href='"+ data[i] +"' target='_blank'>Metadaten</a></li>", "linklist", "add");
    }*/else{
      //console.log("KEIN BILD: "+ data[i]);
      info_container_add("<li><a href='"+ data[i] +"' target='_blank'>"+ data[i] +"</a></li>", "linklist", "add");
    }
    info_container_add("<hr>", "linklist", "add");
  }
  global_data = data_vid;
  info_container_add("<li><a href='#' onclick='open_additional_data();'>Zusätzliche Daten in Konsole anzeigen</a></li>", "linklist", "add");
  //document.getElementById("info_container_close").addEventListener("click", info_close);
  //info_resize();
  prepare_info_container();
}

function open_additional_data(){
  console.log(global_data);
}

function prepare_info_container(){
  info_container_close_button = document.getElementById("info_container_close"); //Experimentell: muss neu definiert werden 
  info_container_info_button = document.getElementById("info_container_info_open"); //Experimentell: muss neu definiert werden 
  info_container = document.getElementById("info_container");
  info_container_innerHTML = info_container.innerHTML;
  info_container_open();
}