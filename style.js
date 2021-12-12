var html, body, darkmode_button, fensterBreite, fensterHoehe, info_background; //Variablen Definieren

function load_style(){
    //Styleelemente in Variablen 
    info_background = document.getElementById("info_background");
    info_conainer = document.getElementById("info_container");
    darkmode_button = document.getElementById("darkmode_button"); 
    html = document.getElementsByTagName("html")[0];
    body = document.getElementsByTagName("body")[0];

    info_background.addEventListener("click", info_close);

    info_resize();

    //Darkmode
    if(localStorage.getItem("darkmode")){
        if(localStorage.getItem("darkmode") == "true"){
            darkmode_button.innerHTML = "Hell";
            style_toggle("dark");
        }else if(localStorage.getItem("darkmode") == "false"){
            darkmode_button.innerHTML = "Dunkel";
            style_toggle("light");
        }
    }else{
        localStorage.setItem("darkmode", false);
    }

}

function style_toggle(mode){ // Darkmode toggle (mode:[light,dark])
    html.classList.remove("dark", "light");
    html.classList.add(mode);
}

function darkmode(){ // Darkmode über Button wechseln
    if(localStorage.getItem("darkmode") == "false"){
        localStorage.setItem("darkmode", true);
        darkmode_button.innerHTML = "Hell";
        style_toggle("dark");
    }else if(localStorage.getItem("darkmode") == "true"){
        localStorage.setItem("darkmode", false);
        darkmode_button.innerHTML = "Dunkel";
        style_toggle("light");
    }
}

function info_resize(){
    fensterHoehe = html.scrollHeight//window.innerHeight;
    //fensterBreite = body.clientWidth + ( window.innerWidth - body.clientWidth );//window.innerWidth;
    //info_background.style.width = fensterBreite +"px";
    //info_background.style.height = fensterHoehe +"px";
    //info_container.style.width = fensterBreite +"px";
    //info_container.style.height = fensterHoehe +"px";
    console.log("Feldresize");
}

function info_close(){
    info_background.style.display = "none";
    info_container.innerHTML = "";
    body.style.overflow = "auto";
}