console.warn("favoriten gestartet");
var favoriten_html = "";
var favoriten_display;

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
        favoriten_display = document.getElementById("favoriten_display");
        favoriten_display.addEventListener("click", favoriten_open);
        favoriten_display.addEventListener("mousedown", (evt)=>{favoriten_display.classList = "f_d_mousedown"});
        favoriten_display.addEventListener("mouseup", (evt)=>{favoriten_display.classList = "f_d_mouseup"});
        favoriten_display.addEventListener("touchstart", (evt)=>{favoriten_display.classList = "f_d_mousedown"});
        favoriten_start();
    }else{
        await sleep(5);
        init_favoriten();
    }
}

function favoriten_start(){
    favoriten_html = "<div class='favoriten_shell'>"
        +"<h1>Favoriten</h1>"
            +"<div class='favoriten_content'>"
            +"</div>"
        +"</div>";
    
}

function favoriten_html_script(){
    var favoriten_content = document.getElementsByClassName("favoriten_content")[0];
    if(localStorage.getItem("nasa_history")){
        JSON.parse(localStorage.getItem("nasa_history")).forEach(async element => {
            //console.log(await get_data("https://images-api.nasa.gov/search?nasa_id="+ element));
            var data = await get_data("https://images-api.nasa.gov/search?nasa_id="+ element);
            console.log(data.collection.items[0]);
            data = data.collection.items[0];
            /*var data = "https://images-api.nasa.gov/search?nasa_id="+ element;
            data = "`"+ data +"`";*/
            var url = "https://images-api.nasa.gov/search?nasa_id="+ element;
            url = "`"+ url +"`";
            favoriten_content.innerHTML += "<div class='f_card' onclick='flyin_close();info_open("+ url +",0, undefined, true)'>"
                +"<img src='"+ data.links[0].href +"'></img>"
                +"<p>"+ data.data[0].title +"</p>"
                +"</div>";
        });
    }
}

async function favoriten_open(){
    await flyin_open(favoriten_html);
    favoriten_html_script();
    load_updatelist(updatelist_luckyapp.content, "Luckyapp");
}