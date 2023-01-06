var cookie_container, cookie_content;

//window.addEventListener("load", load_cookie_stylesheet);

async function init_cookies_stylesheet(){
    if(luckyapp_core.modules.content.loaded){
        var html_content = '<div class="cookie_container_hide" id="cookie_container"><div  id="cookie_content"><h3>Cookies</h3><div>' + luckyapp_core.modules.cookies.text +'</div><div id="cookie_selection"><div id="cookies_close" onclick="cookie_content_close()">Fortfahren</div></div><div></div></div></div>';
        html_content = await createHTML(html_content);
        document.body.appendChild(html_content);
        load_cookie_stylesheet();
    }else{
        await sleep(1);
        init_cookies_stylesheet();
    }
    luckyapp_core.modules.cookies.loaded = true;
}

function load_cookie_stylesheet(){
    cookie_container = document.getElementById("cookie_container");
    cookie_content = document.getElementById("cookie_content");

    cookie_selection_start();

    window.addEventListener('click', function(e){   
        if(cookie_content.contains(e.target)){
          // Clicked in box
        } else{
          // Clicked outside the box
          //console.warn("Keine Präferenz ausgewählt.");
        }
      });
}

function cookie_content_close(){
    localStorage.setItem("cookies", "true");
    cookie_container.classList.add("cookie_container_close");
    var timeout_duration = parseFloat(window.getComputedStyle(cookie_container).animationDuration) * 1000;
        setTimeout(function() {   
            cookie_container.classList = "cookie_container_hide";
            }, timeout_duration); 
}

function cookie_selection_start(){
    if(localStorage.getItem("cookies")){
        if(localStorage.getItem("cookies") == "false"){
            cookie_container.classList = "cookie_container_open";
        }
    }else{
        cookie_container.classList = "cookie_container_open";
        localStorage.setItem("cookies", "false");
    }
}