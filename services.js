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
    services_html = "<div class='services_content'>"
        +"<h1>Services Bereich</h1>"
        +"<div>Hier entsteht der Servicebereich.</div>"
        +"<div id='services_settings_container'>"
            +"<h2>Settings</h2>"
            +"<div>preview_img: <input id='n_s_pi' list='p_i_l' type='text' value='"+ luckyapp_core.page_config.settings.preview_img +"' onchange='settings_change(this)'></input></div>"
            +"<datalist id='p_i_l'><option value='thumb.jpg'><option value='large.jpg'><option value='small.jpg'><option value='orig.jpg'></datalist>"
            +"<div>preview_mp4: <input id='n_s_pv' list='p_m_l' type='text' value='"+ luckyapp_core.page_config.settings.preview_mp4 +"' onchange='settings_change(this)'></input></div>"
            +"<datalist id='p_m_l'><option value='preview.mp4'><option value='large.mp4'><option value='orig.mp4'></datalist>"
            +"<div>loading_info: <input id='n_s_li' type='checkbox' onchange='settings_change(this)'></input></div>"
            +"<button onclick='settings_reset()'>Auf Standard zurücksetzen</button>"
        +"</div>"
        +"<div>"
            +"<h2>Updates</h2>"
            +"<div>Zu einigen Updates sind keine genauen Angaben verf&uuml;gbar.</div>"
            +"<ul id='updatelist'></ul>"
        +"</div>"
        +"<div>"
            +"<h2>Zuk&uuml;nftige 	&Auml;nderungen:</h2>"
            +"<p>Diese Funktionen und 	&auml;nderungen werden in k&uuml;nftigen Versionen hinzugef&uuml;gt:</p>"
            +"<ul>"
                +"<li>Favoriten</li>"
                +"<li>Suchfilter</li>"
            +"</ul>"
        +"</div>"
        +"</div>";
}

function services_html_script(){
    document.getElementById("n_s_li").checked = luckyapp_core.page_config.settings.loading_info;
}

function services_start(){
    var s_updatelist = luckyapp_core.modules.updates.updatelists.luckyapp.list.content;
    luckyapp_core.page_config.version = s_updatelist[0].id;
    console.log(luckyapp_core);
    var version_display = document.getElementById("version_display");
    version_display.innerHTML = "Version: "+ luckyapp_core.page_config.version;
    version_display.addEventListener("click",async ()=>{
        services_html_change();
        await flyin_open(services_html);
        services_html_script();
        load_updatelist(updatelist_luckyapp.content, "Luckyapp");
    });
}

function settings_init(){
    var settings_version = 2;
    if(localStorage.getItem("Nasa_settings")){
        if(settings_version > JSON.parse(localStorage.getItem("Nasa_settings")).settings_version){
            localStorage.removeItem("Nasa_settings");
            settings_init();
        }
        luckyapp_core.page_config.settings = JSON.parse(localStorage.getItem("Nasa_settings"));
    }else{
        luckyapp_core.page_config.settings = { //standard settings
            settings_version: settings_version,
            preview_img:"thumb.jpg",
            preview_mp4:"preview.mp4",
            loading_info: true
        }
        localStorage.setItem("Nasa_settings", JSON.stringify(luckyapp_core.page_config.settings));
    }
}

function settings_change(input){
    if(input.id == "n_s_pi"){
        luckyapp_core.page_config.settings.preview_img = input.value;
    }else if(input.id == "n_s_pv"){
        luckyapp_core.page_config.settings.preview_mp4 = input.value;
    }else if(input.id == "n_s_li"){
        luckyapp_core.page_config.settings.loading_info = input.checked;
    }
    localStorage.setItem("Nasa_settings", JSON.stringify(luckyapp_core.page_config.settings));
    info_show("Einstellungen gespeichert.","success");
}

async function settings_reset(){
    if(localStorage.getItem("Nasa_settings")){
        localStorage.removeItem("Nasa_settings");
    }
    settings_init();
    flyin_close();
    setTimeout(()=>{
        document.getElementById("version_display").click();
    },parseFloat(window.getComputedStyle(version_history_container).animationDuration) * 1000 + 10);
}