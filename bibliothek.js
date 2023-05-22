var bibliothek_html = "";
var bibliothek_display;

async function init_favoriten(){
    if(luckyapp_core.loaded){
        /*services_html = "<div style='padding:0 1em 1em 1em'>"
        +"<h1>Services Bereich</h1>"
        +"<div>Hier entsteht der Servicebereich.<div>"
        +"<div>"
        +"<h2>Settings</h2>"
        +"<div>preview_img: <input id='n_s_pi' type='text' value='"+ luckyapp_core.page_config.settings.preview_img +"' onchange='settings_change(this)'></input></div>"
        +"</div>"
        +"</div>";*/
        bibliothek_display = document.getElementById("bibliothek_display");
        bibliothek_display.addEventListener("click", bibliothek_open);
        bibliothek_display.addEventListener("mousedown", (evt)=>{bibliothek_display.classList = "f_d_mousedown"});
        bibliothek_display.addEventListener("mouseup", (evt)=>{bibliothek_display.classList = "f_d_mouseup"});
        bibliothek_display.addEventListener("touchstart", (evt)=>{bibliothek_display.classList = "f_d_mousedown"});
        bibliothek_start();
    }else{
        await sleep(5);
        init_bibliothek();
    }
}

function bibliothek_start(){
    bibliothek_html = "<div class='bibliothek_shell'>"
        +"<h1>Bibliothek</h1>"
            +"<h2><span style='text-decoration:none'>❤️</span>Favoriten</h2>"
                +"<div class='favoriten_content bibliothek_content'>"
                    +"<p>Keine Favoriten vorhanden.</p>"
                +"</div>"
            +"<h2>🕒Verlauf</h2>"
                +"<div class='verlauf_content bibliothek_content'>"    
                    +"<p>Kein Verlauf verfügbar.</p>"
                +"</div>"
        +"</div>";
    
}

function verlauf_html_script(){
    var verlauf_content = document.getElementsByClassName("verlauf_content")[0];
    verlauf_content.innerHTML = "";
    if(localStorage.getItem("nasa_history")){
        JSON.parse(localStorage.getItem("nasa_history")).forEach(async element => {
            //console.log(await get_data("https://images-api.nasa.gov/search?nasa_id="+ element));
            var data = await get_data("https://images-api.nasa.gov/search?nasa_id="+ element, true);
            console.log(data.collection.items[0]);
            data = data.collection.items[0];
            /*var data = "https://images-api.nasa.gov/search?nasa_id="+ element;
            data = "`"+ data +"`";*/
            var url = "https://images-api.nasa.gov/search?nasa_id="+ element;
            url = "`"+ url +"`";
            verlauf_content.innerHTML += "<div class='b_card' onclick='flyin_close();info_open("+ url +",0, undefined, true)'>"
                +"<img src='"+ data.links[0].href +"'></img>"
                +"<p>"+ data.data[0].title +"</p>"
                +"</div>";
        });
    }else{
        verlauf_content.innerHTML = "<p>Kein Verlauf verfügbar.</p>";
    }
}

function favoriten_html_script(){
    var favoriten_content = document.getElementsByClassName("favoriten_content")[0];
    favoriten_content.innerHTML = "";
    if(localStorage.getItem("nasa_favoriten")){
        JSON.parse(localStorage.getItem("nasa_favoriten")).forEach(async element => {
            //console.log(await get_data("https://images-api.nasa.gov/search?nasa_id="+ element));
            var data = await get_data("https://images-api.nasa.gov/search?nasa_id="+ element, true);
            console.log(data.collection.items[0]);
            data = data.collection.items[0];
            /*var data = "https://images-api.nasa.gov/search?nasa_id="+ element;
            data = "`"+ data +"`";*/
            var url = "https://images-api.nasa.gov/search?nasa_id="+ element;
            url = "`"+ url +"`";
            favoriten_content.innerHTML += "<div class='b_card' onclick='flyin_close();info_open("+ url +",0, undefined, true)'>"
                +"<img src='"+ data.links[0].href +"'></img>"
                +"<p>"+ data.data[0].title +"</p>"
                +"</div>";
        });
    }else{
        favoriten_content.innerHTML = "<p>Kein Verlauf verfügbar.</p>";
    }
}

async function bibliothek_open(){
    await flyin_open(bibliothek_html);
    favoriten_html_script();
    verlauf_html_script();
}