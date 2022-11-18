var error_container;

async function start_error_stylesheet(){
    if(luckyapp_core.modules.content.loaded){
        var html_content = '<div class="error_style_container"><div id="error_container" class="error_hidden"></div></div>';
        html_content = await createHTML(html_content);
        document.body.appendChild(html_content);
        load_error_stylesheet();
    }else{
        await sleep(1);
        start_error_stylesheet();
    }
    luckyapp_core.modules.error.loaded = true;
}

function load_error_stylesheet(){
    error_container = document.getElementById("error_container");
}

function error_show(error_info, error_type){   
    if(error_type == "closed"){ //vorgefertigter Typ
        error_container.innerHTML = "Keine Verbindung zum Server möglich. <br>Bitte später noch einmal versuchen oder Seite neu Laden.";
    }else{
        error_container.innerHTML = error_info;
    }
    error_container.classList = "fade_in_out";
    var timeout_duration = parseFloat(window.getComputedStyle(error_container).animationDuration) * 1000;
        setTimeout(function() {   
            error_container.classList = "error_hidden";
            }, timeout_duration); 
}