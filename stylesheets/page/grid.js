var body_init, body, page, header;

async function start_grid_stylesheet(){
    body = document.body;
    body_init = body.innerHTML;
    body.innerHTML += "<div class='page'></div>";
    page = document.getElementsByClassName("page")[0];
    page.innerHTML += "<div class='header'></div>";
        header = document.getElementsByClassName("header")[0];
        header.classList.add("grid_100");
    //console.log("grid_red");
    luckyapp_core.modules.preset.loaded = true;
}