var footer;

async function start_footer_stylesheet(){
    if(luckyapp_core.modules.content.loaded || luckyapp_core.modules.footer.forceload){
        page.innerHTML += "<div class='footer grid_100'></div>";
        footer = document.getElementsByClassName("footer")[0];
        /*for(i=0;luckyapp_core.page_config.modules.footer.links.length;i++){
            footer.innerHTML += "<a href='"+ get_link(luckyapp_core.page_config.modules.footer.links[i].href) +"'>"+ luckyapp_core.page_config.modules.footer.links[i].text +"</a>";
        }*/
        if(luckyapp_core.page_config.modules.footer.custom_links){
            for(i=0; i < luckyapp_core.page_config.modules.footer.links.length; i++){
                footer.innerHTML += "<a href='"+ get_link(luckyapp_core.page_config.modules.footer.links[i].href) +"'>"+ luckyapp_core.page_config.modules.footer.links[i].text +"</a>";
            }
        }else{
            for(i=0; i < luckyapp_core.modules.footer.links.length; i++){
                footer.innerHTML += "<a href='"+ get_link(luckyapp_core.modules.footer.links[i].href) +"'>"+ luckyapp_core.modules.footer.links[i].text +"</a>";
            }
        }
    }else{
        if(!luckyapp_core.modules.content.active){
            luckyapp_core.modules.footer.forceload = true;
        }
        await sleep(1);
        start_footer_stylesheet();
    }
}