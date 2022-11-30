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
}

async function nasa_start(subject){
    var data = await get_data("https://images-api.nasa.gov/search?q="+ subject);
    data = data.collection;
    console.log(data);
    if(data.links){
        for(k=0;k<data.links.length;k++){
            if(data.links[k].rel == "next"){
                output.innerHTML = "<div id='next_page_but' onclick='next_page(`"+ data.links[k].href +"`)'>Laden</div>";
            }else{
                output.innerHTML = ""; 
            }
        }
    }else{
        output.innerHTML = "";
    }
    for(i=0;i<data.items.length;i++){
        for(j=0;j<data.items[i].links.length;j++){
            if(data.items[i].links[j].render == "image"){
                output.innerHTML += "<img onclick='info_open(`"+ data.href +"`, `"+ i +"`)' src='"+ data.items[i].links[j].href +"'></img>";
            }
        }
    }
    if(document.getElementById("next_page_but")){
        document.getElementById("next_page_but").style.display = "block";
    }
}

async function next_page(source){
    console.log("next_page");
    var data = await get_data(source.replace("http", "https"));
    data = data.collection;
    console.log(data);
    if(data.links){
        for(k=0;k<data.links.length;k++){
            if(data.links[k].rel == "next"){
                document.getElementById("next_page_but").onclick = "next_page(`"+ data.links[k].href +"`)";
            }else{
            }
        }
    }else{
    }
    for(i=0;i<data.items.length;i++){
        for(j=0;j<data.items[i].links.length;j++){
            if(data.items[i].links[j].render == "image"){
                output.innerHTML += "<img onclick='info_open(`"+ data.href +"`, `"+ i +"`)' src='"+ data.items[i].links[j].href +"'></img>";
            }
        }
    }
    if(document.getElementById("next_page_but")){
        document.getElementById("next_page_but").style.display = "block";
    }
}

async function info_open(url, index){
    var data = await get_data(url);
    data = data.collection.items[index];
    console.log(data);
    var collection = await get_data(data.href);
    console.log(collection);
    document.getElementById("fi_title").innerHTML = data.data[0].title;
    document.getElementById("fi_img").src = data.links[0].href;
    document.getElementById("fi_description").innerHTML = data.data[0].description;
    document.getElementById("fi_sources").innerHTML = "";
    datas = data.data[0];
    document.getElementById("fi_tab_center").innerHTML = datas.center;
    var keywords_string = "";
    datas.keywords.forEach(element => {
        keywords_string += "<div class='keyword'>"+ element.replace(",", "") +"</div>";
    });
    document.getElementById("fi_tab_keywords").innerHTML = "<div class='keywords_container'>"+ keywords_string +"</div>";
    document.getElementById("fi_tab_location").innerHTML = datas.location;
    document.getElementById("fi_tab_media_type").innerHTML = datas.media_type;
    document.getElementById("fi_tab_nasa_id").innerHTML = datas.nasa_id;
    document.getElementById("fi_tab_center").innerHTML = datas.center;
    document.getElementById("fi_tab_date_created").innerHTML = datas.date_created;
    document.getElementById("fi_tab_secondary_creator").innerHTML = datas.secondary_creator;
    document.getElementById("fi_tab_other").innerHTML = JSON.stringify(datas);
    for(u=0;u<collection.length;u++){
        if(collection[u].includes("metadata.json")){
            document.getElementById("fi_sources").innerHTML += "<li><a href='"+ collection[u] +"'>Metadaten</a></li>";
        }else if(collection[u].includes("orig.jpg")){
            document.getElementById("fi_sources").innerHTML += "<li><a href='"+ collection[u] +"'>Original JPG</a></li>";
        }else if(collection[u].includes("large.jpg")){
            document.getElementById("fi_sources").innerHTML += "<li><a href='"+ collection[u] +"'>Groß JPG</a></li>";
        }else if(collection[u].includes("medium.jpg")){
            document.getElementById("fi_sources").innerHTML += "<li><a href='"+ collection[u] +"'>Medium JPG</a></li>";
        }else if(collection[u].includes("small.jpg")){
            document.getElementById("fi_sources").innerHTML += "<li><a href='"+ collection[u] +"'>Klein JPG</a></li>";
        }else if(collection[u].includes("thumb.jpg")){
            document.getElementById("fi_sources").innerHTML += "<li><a href='"+ collection[u] +"'>Thumb JPG</a></li>";
        }else{
            document.getElementById("fi_sources").innerHTML += "<li><a href='"+ collection[u] +"'>"+ collection[u] +"</a></li>";
        }
    }
    n_flyin_open();
}

async function get_data(url){
    //var url = "https://www.faderstart.wdr.de/radio/radiotext/streamtitle_1live.txt";
    var data
    
    await fetch(url)
    
    .then((response) => response.text())

    .then((data_text) => {data = JSON.parse(data_text)});
    return data;
}

function n_flyin_open(){
    var n_flyin_background = document.getElementById("n_flyin_background");
    var n_flyin_container = document.getElementById("n_flyin_container");
    n_flyin_background.style.display = "flex";
    n_flyin_background.style.overflow = "unset";
    document.body.style.overflow = "hidden";
    n_flyin_background.classList = "n_flyin_open_back";
    n_flyin_container.classList = "n_flyin_open_cont";
    setTimeout(function() {
        n_flyin_background.style.overflow = "auto";
      }, /*timeout_duration*/500); 
}

function n_flyin_close(){
    var n_flyin_background = document.getElementById("n_flyin_background");
    var n_flyin_container = document.getElementById("n_flyin_container");
    n_flyin_background.classList = "n_flyin_close_back";
    n_flyin_container.classList = "n_flyin_close_cont";
    //var timeout_duration = parseFloat(window.getComputedStyle(n_flyin_background).animationDuration) * 1000;
    setTimeout(function() {
      n_flyin_background.style.display = "none";
      document.body.style.overflow = "auto";
    }, /*timeout_duration*/500); 
}