var header_title;

async function start_header_stylesheet(){
    if(luckyapp_core.modules.preset.loaded || luckyapp_core.modules.header.forceload){
        header.innerHTML += "<div class='header_title'></div>";
        header_title = document.getElementsByClassName("header_title")[0];
        header_title.innerHTML = "<h1>"+ luckyapp_core.page_config.modules.header.title +"</h1>";
        if(luckyapp_core.page_config.modules.header.subtitle != ""){
            header_title.innerHTML += "<h2>"+ luckyapp_core.page_config.modules.header.subtitle +"</h2>"
        }
        //console.log("head_red");
        luckyapp_core.modules.header.loaded = true;
    }else{
        if(!luckyapp_core.modules.preset.active){
            luckyapp_core.modules.header.forceload = true;
        }
        await sleep(1);
        start_header_stylesheet();
    }
}