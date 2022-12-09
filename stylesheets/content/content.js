var content, content_init, card;

async function start_content_stylesheet(){
    //console.log(luckyapp_core.modules.preset.loaded == true && luckyapp_core.modules.header.loaded == true && luckyapp_core.modules.navbar.loaded == true);
    if((luckyapp_core.modules.preset.loaded && luckyapp_core.modules.header.loaded && luckyapp_core.modules.navbar.loaded) || luckyapp_core.modules.content.forceload){
        content_init = document.getElementById("content").outerHTML;
        document.getElementById("content").remove();
        console.log(luckyapp_core.modules.preset.loaded);
        page.innerHTML += content_init;
        content = document.getElementById("content");
        content.style = "";
        load_card();
        luckyapp_core.modules.content.loaded = true;
    }else{
        if((luckyapp_core.modules.preset.active && luckyapp_core.modules.header.active && luckyapp_core.modules.navbar.active)){
        }else{
            luckyapp_core.modules.content.forceload = true;
        }
        await sleep(1);
        start_content_stylesheet();
    }
}

function load_card(){
}