console.warn("services gestartet");
var services_html = "";
settings_init();
services_init();

async function services_init(){
    if(luckyapp_core.loaded){
        /*services_html = "<div style='padding:0 1em 1em 1em'>"
        +"<h1>Services Bereich</h1>"
        +"<div>Hier entsteht der Servicebereich.<div>"
        +"<div>"
        +"<h2>Settings</h2>"
        +"<div>preview_img: <input id='n_s_pi' type='text' value='"+ luckyapp_core.page_config.settings.preview_img +"' onchange='settings_change(this)'></input></div>"
        +"</div>"
        +"</div>";*/
        services_start();
    }else{
        await sleep(5);
        services_init();
    }
}

function services_html_change(){
    services_html = "<div style='padding:0 1em 1em 1em'>"
        +"<h1>Services Bereich</h1>"
        +"<div>Hier entsteht der Servicebereich.<div>"
        +"<div>"
        +"<h2>Settings</h2>"
        +"<div>preview_img: <input id='n_s_pi' type='text' value='"+ luckyapp_core.page_config.settings.preview_img +"' onchange='settings_change(this)'></input></div>"
        +"</div>"
        +"</div>";
}

function services_start(){
    var s_updatelist = luckyapp_core.modules.updates.updatelists.luckyapp.list.content;
    luckyapp_core.page_config.version = s_updatelist[0].id;
    console.log(luckyapp_core);
    var version_display = document.getElementById("version_display");
    version_display.innerHTML = "Version: "+ luckyapp_core.page_config.version;
    version_display.addEventListener("click",()=>{services_html_change();flyin_open(services_html)})
}

function settings_init(){
    if(localStorage.getItem("Nasa_settings")){
        luckyapp_core.page_config.settings = JSON.parse(localStorage.getItem("Nasa_settings"));
    }else{
        luckyapp_core.page_config.settings = {
            preview_img:"thumb.jpg"
        }
        localStorage.setItem("Nasa_settings", JSON.stringify(luckyapp_core.page_config.settings));
    }
}

function settings_change(input){
    console.log(input.value);
    if(input.id == "n_s_pi"){
        luckyapp_core.page_config.settings.preview_img = input.value;
    }
    localStorage.setItem("Nasa_settings", JSON.stringify(luckyapp_core.page_config.settings));
}