console.warn("services gestartet");
var services_html = "";
services_init();

async function services_init(){
    if(luckyapp_core.loaded){
        services_html = "<div style='padding:0 1em 1em 1em'>"
        +"<h1>Services Bereich</h1>"
        +"<div>Hier entsteht der Servicebereich.<div>"
        +"</div>";
        services_start();
    }else{
        await sleep(5);
        services_init();
    }
}


function services_start(){
    var s_updatelist = luckyapp_core.modules.updates.updatelists.luckyapp.list.content;
    luckyapp_core.page_config.version = s_updatelist[0].id;
    console.log(luckyapp_core);
    var version_display = document.getElementById("version_display");
    version_display.innerHTML = "Version: "+ luckyapp_core.page_config.version;
    version_display.addEventListener("click",()=>{flyin_open(services_html)})
}