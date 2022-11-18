var navbar;

async function start_navbar_stylesheet(){
    if(luckyapp_core.modules.header.loaded || luckyapp_core.modules.navbar.forceload){
        header.innerHTML += "<div class='header_navbar'></div>";
        navbar = document.getElementsByClassName("header_navbar")[0];
        if(luckyapp_core.page_config.modules.navbar.custom_links){
            for(i=0; i < luckyapp_core.page_config.modules.navbar.links.length; i++){
                var style = "";
                if(luckyapp_core.page_config.modules.navbar.links[i].active){
                    style = "background-color: rgba(95, 95, 31, 0.562)";
                }
                navbar.innerHTML += "<a href='"+ get_link(luckyapp_core.page_config.modules.navbar.links[i].href) +"' style='"+ style +"'>"+ luckyapp_core.page_config.modules.navbar.links[i].text +"</a>";
            }
        }else{
            for(i=0; i < luckyapp_core.modules.navbar.links.length; i++){
                var style = "";
                if((window.location.href.search(luckyapp_core.modules.navbar.links[i].href) > -1 && luckyapp_core.modules.navbar.links[i].href != "index.html" || (luckyapp_core.modules.navbar.links[i].href == "index.html" && window.location.href.search("Luckyapp/index.html") > -1))){
                    style = "background-color: rgba(95, 95, 31, 0.562)";
                }
                navbar.innerHTML += "<a href='"+ get_link(luckyapp_core.modules.navbar.links[i].href) +"' style='"+ style +"'>"+ luckyapp_core.modules.navbar.links[i].text +"</a>";
            }
        }
        luckyapp_core.modules.navbar.loaded = true;
    }else{
        if(!luckyapp_core.modules.header.active){
            luckyapp_core.modules.navbar.forceload = true;
        }
        await sleep(1);
        start_navbar_stylesheet();
    }
}