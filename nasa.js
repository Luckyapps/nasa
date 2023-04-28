var output;

function nasa_init(){
    output = document.getElementById("nasa_output");
    document.addEventListener("keydown",(evt)=>{
        if(evt.key == "Enter"){
            nasa_start(document.getElementById("nasa_input").value);
        }
    });
    
    document.getElementById("nasa_input_but").addEventListener("click",()=>{
        nasa_start(document.getElementById("nasa_input").value);
    });

    document.getElementById("n_flyin_close").addEventListener("click", n_flyin_close);
    document.getElementById("n_flyin_background").addEventListener('click', container_clicked);
}

async function nasa_start(subject){
    output.innerHTML = "";
    var data = await get_data("https://images-api.nasa.gov/search?q="+ subject);
    data = data.collection;
    console.log(data);
    document.getElementById("results").innerHTML = data.metadata.total_hits +" Ergebnisse gefunden";
    document.getElementById("results").style.display = "block";
    for(i=0;i<data.items.length;i++){
        if(data.items[i].links){
            for(j=0;j<data.items[i].links.length;j++){
                if(data.items[i].links[j].render == "image"){
                    output.innerHTML += "<img onclick='info_open(`"+ data.href +"`, `"+ i +"`)' src='"+ data.items[i].links[j].href +"'></img>";
                }
            }
        }else if(data.items[i].data[0].media_type == "audio"){
            output.innerHTML += "<div class='audio_card' onclick='info_open(`"+ data.href +"`, `"+ i +"`)'>"+ data.items[i].data[0].title +"</div>";
        }
    }
    if(data.links){
        for(k=0;k<data.links.length;k++){
            if(data.links[k].rel == "next"){
                output.innerHTML += "<div id='next_page_but' onclick='next_page(`"+ data.links[k].href +"`)'>Laden</div>";
            }/*else{
                output.innerHTML = ""; 
            }*/
        }
    }/*else{
        output.innerHTML = "";
    }*/
    if(document.getElementById("next_page_but")){
        document.getElementById("next_page_but").style.display = "block";
    }
}

async function next_page(source){
    console.log("next_page");
    document.getElementById("next_page_but").remove();
    var data = await get_data(source.replace("http", "https"));
    data = data.collection;
    console.log(data);
    for(i=0;i<data.items.length;i++){
        if(data.items[i].links){
            for(j=0;j<data.items[i].links.length;j++){
                if(data.items[i].links[j].render == "image"){
                    output.innerHTML += "<img onclick='info_open(`"+ data.href +"`, `"+ i +"`)' src='"+ data.items[i].links[j].href +"'></img>";
                }
            }
        }else if(data.items[i].data[0].media_type == "audio"){
            output.innerHTML += "<div class='audio_card' onclick='info_open(`"+ data.href +"`, `"+ i +"`)'>"+ data.items[i].data[0].title +"</div>";
        }else{
            output.innerHTML += "<img onclick='info_open(`"+ data.href +"`, `"+ i +"`)' alt='NOPREVIEW'></img>";
        }
    }
    if(data.links){
        for(k=0;k<data.links.length;k++){
            if(data.links[k].rel == "next"){
                output.innerHTML += "<div id='next_page_but' onclick='next_page(`"+ data.links[k].href +"`)'>Laden</div>";
            }
        }
    }
    if(document.getElementById("next_page_but")){
        document.getElementById("next_page_but").style.display = "block";
    }
}


async function info_open(url, index){
    var data = await get_data(url);
    data = data.collection.items[index]; //komplettes item
    console.log(data);
    var collection = await get_data(data.href); //collection des elements
    console.log(collection);
    document.getElementById("fi_title").innerHTML = data.data[0].title;
    /*luckyapp_core.page_config.settings = {
        preview_img:"thumb.jpg"
    };*/
    for(i=0;i<collection.length;i++){
        if(luckyapp_core.page_config.settings){
            if(luckyapp_core.page_config.settings.preview_img){
                try{ //Wenn media_type != audio
                    if(collection[i].includes(luckyapp_core.page_config.settings.preview_img)){
                        document.getElementById("fi_img").src = http_fix(collection[i]);
                        break;
                    }else{
                        document.getElementById("fi_img").src = http_fix(data.links[0].href);
                    }
                    document.getElementById("fi_audio").style.display = "none";
                    document.getElementById("fi_audio_album").style.display = "none";
                }
                catch{ //Wenn media_type = audio
                    //document.getElementById("fi_img").src = "images/earth.jpg";
                    /*document.getElementById("fi_img").onclick = ()=>{
                        initAudio(data.data[0], collection);
                    }
                    document.getElementById("fi_audio").style.display = "block";
                    document.getElementById("fi_audio").onclick = ()=>{
                        initAudio(data.data[0], collection);
                    }*/
                }
            }
        }else{
            document.getElementById("fi_img").src = http_fix(data.links[0].href);
        }
    }
    if(data.data[0].media_type == "video"){
        document.getElementById("fi_description").innerHTML = data.data[0].description;
        document.getElementById("fi_img").classList.add("fi_img_video");
        document.getElementById("fi_img").addEventListener("click", ()=>{
            console.log("Lade Video");
            for(u=0;u<collection.length;u++){
                if(collection[u].includes(luckyapp_core.page_config.settings.preview_mp4)){
                    var vidsrc = collection[u];
                }
            }
            document.getElementById("fi_img").outerHTML = "<video class='fi_video' id='fi_img' controls src='"+ http_fix(vidsrc) +"'>";
        });
    }else if(data.data[0].media_type == "audio"){
        document.getElementById("fi_description").innerHTML = data.data[0].description_508;
        if(data.data[0].album){
            document.getElementById("fi_audio_album").style.display = "block";
            document.getElementById("fi_audio_album").innerHTML = data.data[0].album[0];
        }
        document.getElementById("fi_audio").style.display = "block";
        document.getElementById("fi_audio").onclick = ()=>{
            loadMediaPlayer(data.data[0], collection);
            }
    }else{
        document.getElementById("fi_description").innerHTML = data.data[0].description;
    }
    document.getElementById("fi_sources").innerHTML = "";
    datas = data.data[0]; //daten des items
    document.getElementById("fi_tab_center").innerHTML = datas.center;
    var keywords_string = "";
    if(datas.keywords){
        datas.keywords.forEach(element => {
            keywords_string += "<div class='keyword'>"+ element.replace(",", "") +"</div>";
        });
    }
    document.getElementById("fi_tab_keywords").innerHTML = "<div class='keywords_container'>"+ keywords_string +"</div>";
    document.getElementById("fi_tab_location").innerHTML = datas.location;
    document.getElementById("fi_tab_media_type").innerHTML = datas.media_type;
    if(datas.media_type == "video"){
        document.getElementById("fi_tab_media_type").style.backgroundColor = "#4d7e4d";
    }else if(datas.media_type == "image"){
        document.getElementById("fi_tab_media_type").style.backgroundColor = "#7e4d4d";
    }
    document.getElementById("fi_tab_nasa_id").innerHTML = datas.nasa_id;
    document.getElementById("fi_tab_center").innerHTML = datas.center;
    document.getElementById("fi_tab_date_created").innerHTML = datas.date_created;
    document.getElementById("fi_tab_secondary_creator").innerHTML = datas.secondary_creator;

    if(luckyapp_core.page_config.settings.showData){
        document.getElementById("fi_tab_other").innerHTML = JSON.stringify(datas);
    }else{
        document.getElementById("fi_tab_other").innerHTML = "Datenanzeige in den Einstellungen Deaktiviert.";
    }
    var links_unknown = "";
    for(u=0;u<collection.length;u++){
        if(collection[u].includes("metadata.json")){
            document.getElementById("fi_sources").innerHTML += "<li><a href='"+ collection[u] +"'>Metadaten</a></li>";
        }else if(collection[u].includes("orig.jpg")){
            document.getElementById("fi_sources").innerHTML += "<li><a href='"+ collection[u] +"'>Original JPG</a></li>";
        }else if(collection[u].includes("large.jpg")){
            document.getElementById("fi_sources").innerHTML += "<li><a href='"+ collection[u] +"'>Gross JPG</a></li>";
        }else if(collection[u].includes("medium.jpg")){
            document.getElementById("fi_sources").innerHTML += "<li><a href='"+ collection[u] +"'>Medium JPG</a></li>";
        }else if(collection[u].includes("small.jpg")){
            document.getElementById("fi_sources").innerHTML += "<li><a href='"+ collection[u] +"'>Klein JPG</a></li>";
        }else if(collection[u].includes("thumb.jpg")){
            document.getElementById("fi_sources").innerHTML += "<li><a href='"+ collection[u] +"'>Thumb JPG</a></li>";
        }else if(collection[u].includes("orig.tif")){
            document.getElementById("fi_sources").innerHTML += "<li><a href='"+ collection[u] +"'>Original TIFF</a></li>";
        }else if(collection[u].includes("large.mp4")){
            document.getElementById("fi_sources").innerHTML += "<li><a href='"+ collection[u] +"'>Grosses Video [mp4]</a></li>";
        }else if(collection[u].includes("medium.mp4")){
            document.getElementById("fi_sources").innerHTML += "<li><a href='"+ collection[u] +"'>Mittelgrosses Video [mp4]</a></li>";
        }else if(collection[u].includes("small.mp4")){
            document.getElementById("fi_sources").innerHTML += "<li><a href='"+ collection[u] +"'>Kleines Video [mp4]</a></li>";
        }else if(collection[u].includes("orig.mp4")){
            document.getElementById("fi_sources").innerHTML += "<li><a href='"+ collection[u] +"'>Originalvideo [mp4]</a></li>";
        }else if(collection[u].includes("preview.mp4")){
            document.getElementById("fi_sources").innerHTML += "<li><a href='"+ collection[u] +"'>Previewvideo [mp4]</a></li>";
        }else{
            links_unknown += "<li><a href='"+ collection[u] +"'>"+ collection[u] +"</a></li>";
        }
    }document.getElementById("fi_sources").innerHTML += links_unknown;
    n_flyin_open();
    info_hide();
}

async function get_data(url){
    info_hide();
    if(luckyapp_core.page_config.settings.loading_info){
        info_show("Daten werden geladen...");
    }
    //var url = "https://www.faderstart.wdr.de/radio/radiotext/streamtitle_1live.txt";
    var data

    if(!url.includes("https")){
        if(url.includes("http")){
            url = url.replace("http","https");
            //console.log(url);
        }
    }else{
        //console.log(url);
    }
    
    await fetch(url)
    
    .then((response) => response.text())

    .then((data_text) => {data = JSON.parse(data_text)});
    info_hide();
    if(luckyapp_core.page_config.settings.loading_info){
        info_show("Daten geladen", "success");
    }
    return data;
}

function container_clicked(e){
    if (document.getElementById("n_flyin_container").contains(e.target)){
        // Clicked in box
        console.log("clicked_inside");
      }else{
        if(document.getElementById("n_flyin_container").contains(e.target) != true && e.target.id != "fi_img"){
            console.log("clicked_outside");
            n_flyin_close();
            // Clicked outside the box
        }
      }
}

window.addEventListener('popstate', (event) => {
    //console.log(`location: ${document.location}, state: ${JSON.stringify(event.state)}`);
    if(n_flyin_state == "open"){
        n_flyin_close();
        window.history.forward(1);
    }
});

var n_flyin_state

function n_flyin_open(){
    if(location.search == ""){
        var url = "?flyin";
    }else{
        var url = location.search +"&flyin";
    }
    history.pushState({ page: 1 }, "flyin", url);
    n_flyin_state = "open";
    var n_flyin_background = document.getElementById("n_flyin_background");
    var n_flyin_container = document.getElementById("n_flyin_container");
    n_flyin_background.style.display = "flex";
    n_flyin_background.style.overflow = "unset";
    document.body.style.overflow = "hidden";
    document.querySelector("html").style.overflowY = "hidden";
    n_flyin_background.classList = "n_flyin_open_back";
    n_flyin_container.classList = "n_flyin_open_cont";
    setTimeout(function() {
        n_flyin_background.style.overflow = "auto";
      }, /*timeout_duration*/500); 
}

function n_flyin_close(){
    history.back();
    n_flyin_state = "close";
    var n_flyin_background = document.getElementById("n_flyin_background");
    var n_flyin_container = document.getElementById("n_flyin_container");
    n_flyin_background.classList = "n_flyin_close_back";
    n_flyin_container.classList = "n_flyin_close_cont";
    //var timeout_duration = parseFloat(window.getComputedStyle(n_flyin_background).animationDuration) * 1000;
    n_flyin_background.style.overflow = "hidden";
    setTimeout(function() {
        document.querySelector("html").style.overflowY = "";
        n_flyin_background.style.overflow = "";
      n_flyin_background.style.display = "none";
      document.body.style.overflow = "auto";
      document.getElementById("fi_img").outerHTML = "<img id='fi_img'></img>";
    }, /*timeout_duration*/500); 
}

function http_fix(url){
    if(!url.includes("https")){
        if(url.includes("http")){
            url = url.replace("http","https");
            return url;
        }
    }else{
        return url;
    }
}

audioPlaying = false;
var audio, af = 0;

function loadMediaPlayer(data, collection){
    if(player.currentAudio.id){
        player.pause(player.currentAudio.id);
    }
    console.log(data);
    var mediaPlayer = document.getElementById("mediaPlayer");
    var audioTitle = document.getElementById("audioTitle");
    var audioPlaybutton = document.getElementById("audioPlaybutton");
    audioPlaybutton.setAttribute("data-audio", data.nasa_id);
    audioPlaybutton.classList.add("playbutton");
    player.add(data.nasa_id,http_fix(collection[0]), data);
    audioTitle.innerHTML = data.title;
    audioPlaybutton.innerHTML = ">";
    mediaPlayer.style.display = "flex";
    //audio = new Audio(http_fix(collection[0]));
}

function refreshPlaybar(audio){}