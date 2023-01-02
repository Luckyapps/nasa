var updatelist, updatebanner, updatebanner_container, updatebanner_close;

async function start_updates_stylesheet(){
    if(luckyapp_core.modules.content.loaded && luckyapp_core.modules.updates.updatelists.luckyapp.loaded){
        luckyapp_core.modules.updates.updatelists.luckyapp.list = updatelist_luckyapp;
        if(luckyapp_core.page_config.modules.updates.updatelist){
            await load_updatelist(luckyapp_core.modules.updates.updatelists.luckyapp.list.content, "Luckyapp");
        }
        if(luckyapp_core.page_config.modules.updates.updatebanner){
            var html_content = "<div id='updatebanner_container'><div id='updatebanner'><h2></h2><div></div><div id='updatebanner_close'>X</div></div></div>";
            html_content = await createHTML(html_content);
            await document.body.appendChild(html_content);
            updatebanner = document.getElementById("updatebanner");
            updatebanner.addEventListener("click", function () {var pseudo = {value: 0};updates_info_open(pseudo); close_updatebanner()});
            updatebanner_close = document.getElementById("updatebanner_close");
            updatebanner_close.addEventListener("click", close_updatebanner);
            updatebanner_container = document.getElementById("updatebanner_container");
            load_updatebanner(luckyapp_core.modules.updates.updatelists.luckyapp.list.content);
        }

        luckyapp_core.modules.updates.loaded = true;
    }else{
        await sleep(1);
        start_updates_stylesheet();
    }
}

function load_updatelist(list, source, return_required){
    console.log("UPDATE");
    if(source == "Luckyapp"){
        updatelist = document.getElementById("updatelist");
        for(i=0; i< list.length; i++){
            var list_li = "";
            list_li = "<li onclick='updates_info_open(this)' value='"+ i +"'><h3>";
            if(list[i].type == "UPDATE"){
                list_li += "<font color='green'>"+ list[i].type +"</font>";
            }else{
                list_li += "<font color='green'>"+ list[i].type +"</font>";
            }

            if(list[i].date != undefined){
                list_li += " ("+ list[i].date +")";
            }

            list_li += "<u>";

            if(list[i].title != undefined){
                list_li += " "+ list[i].title;
            }else{
                list_li += " "+ list[i].id;
            }

            if(list[i].name != undefined && list[i].name != ""){
                list_li += " : "+ list[i].name;
            }
            list_li += "</u></h3></li>";
            updatelist.innerHTML += list_li;
        }
    }else if(source == "Musik"){
        updatelist = document.getElementById("updatelist");
        for(i=0; i< list.length; i++){
            var list_li = "";
            list_li = "<li onclick='updates_info_open(this, `musik`)' value='"+ i +"'><h3>";
            if(list[i].type == "UPDATE"){
                list_li += "<font color='green'>"+ list[i].type +"</font>";
            }else{
                list_li += "<font color='green'>"+ list[i].type +"</font>";
            }

            if(list[i].date != undefined){
                list_li += " ("+ list[i].date +")";
            }

            list_li += "<u>";

            if(list[i].title != undefined){
                list_li += " "+ list[i].title;
            }else{
                list_li += " "+ list[i].id;
            }

            if(list[i].name != undefined){
                list_li += " : "+ list[i].name;
            }
            list_li += "</u></h3></li>";
            updatelist.innerHTML += list_li;
        }
    }
}

function updates_info_open(src, list_name){
    var i = src.value;
    if(!list_name){
        var list = luckyapp_core.modules.updates.updatelists.luckyapp.list.content;
    }else{
        var list = luckyapp_core.modules.updates.updatelists[list_name].list.content;
    }
    var flyin_content = "";
    flyin_content += "<h1 id='updates_info_header'>"+ list[i].title +" : "+ list[i].name +"</h1><hr>"
                        +"<div class='update_ flyin_content'><p id='updates_info_content' >"+ luckyapp_core.modules.updates.info_window_text +""+ list[i].description +""+ luckyapp_core.modules.updates.info_window_signature +"</p></div>";
    flyin_content = "<div id='updates_info_container'>"+ flyin_content +"<br></div>";
    flyin_open(flyin_content);
}

function load_version_history_updatelist(){
    var list = luckyapp_core.modules.updates.updatelists.luckyapp.list.content;
    var vers_hist_cont = "";
    watermark.innerHTML += " | "+ list[0].id;
    for(i=0; i<list.length;i++){
        vers_hist_cont += "<div class='flyin_content'><h3>"+ list[i].id +" "+ list[i].title +" : "+ list[i].name +"</h3>"+ list[i].description +"</div>"
    }
    vers_hist_cont += "<br>";
    return vers_hist_cont;
}

function load_updatebanner(list){
    if(localStorage.getItem("n_updates_index")){
        if(localStorage.getItem("n_updates_index") < list.length || luckyapp_core.modules.updates.trigger == true){
            console.log("banner go");
            updatebanner_container.style.display = "flex";
            updatebanner.getElementsByTagName("h2")[0].innerHTML = list[0].title;
            updatebanner.getElementsByTagName("div")[0].innerHTML = list[0].description;
        }
    }else{
        localStorage.setItem("n_updates_index", list.length);
        load_updatebanner(list);
    }
}

function close_updatebanner(){
    localStorage.setItem("n_updates_index", luckyapp_core.modules.updates.updatelists.luckyapp.list.content.length);
    updatebanner_container.style.display = "none";
}