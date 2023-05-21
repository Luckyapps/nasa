console.warn("services gestartet");
var services_html = "";
settings_init();
services_init();

async function services_init(){
    if(luckyapp_core.loaded){
        /*services_html = "<div style='padding:0 1em 1em 1em'>"
        +"<h1>Services Bereich</h1>"
        +"<div>Hier entsteht der Servicebereich.<div>"
        +"<div>"
        +"<h2>Settings</h2>"
        +"<div>preview_img: <input id='n_s_pi' type='text' value='"+ luckyapp_core.page_config.settings.preview_img +"' onchange='settings_change(this)'></input></div>"
        +"</div>"
        +"</div>";*/
        services_start();
    }else{
        await sleep(5);
        services_init();
    }
}

function services_html_change(){
    services_html = "<div class='services_content'>"
        +"<h1>Services Bereich</h1>"
        +"<div>Hier entsteht der Servicebereich.</div>"
        +"<div id='services_settings_container'>"
            +"<h2>Settings</h2>"
            +"<div>preview_img: <input id='n_s_pi' list='p_i_l' type='text' value='"+ luckyapp_core.page_config.settings.preview_img +"' onchange='settings_change(this)'></input></div>"
            +"<datalist id='p_i_l'><option value='thumb.jpg'><option value='large.jpg'><option value='small.jpg'><option value='orig.jpg'></datalist>"
            +"<div>preview_mp4: <input id='n_s_pv' list='p_m_l' type='text' value='"+ luckyapp_core.page_config.settings.preview_mp4 +"' onchange='settings_change(this)'></input></div>"
            +"<datalist id='p_m_l'><option value='preview.mp4'><option value='large.mp4'><option value='orig.mp4'></datalist>"
            +"<div>loading_info: <input id='n_s_li' type='checkbox' onchange='settings_change(this)'></input></div>"
            +"<div>Alle daten als String in der Übersicht anzeigen: <input id='n_s_fid' type='checkbox' onchange='settings_change(this)'></input></div>"
        +"</div>"
        +"<div>"
            +"<h2>Zurücksetzen</h2>"
            +"<h3>Einstellungen zurücksetzen</h3>"
                +"<p>Damit werden die Einstellungen auf die Standartwerte zurückgesetzt.</p>"
                +"<button onclick='settings_reset()'>Einstellungen zurücksetzen</button>"
            +"<h3>Gesammte App zurücksetzen</h3>"
                +"<p>Dabei werden alle Daten zurückgesetzt. Dazu zählen z.B.Favoriten und Einstellungen. Auch alle Cookies oder localStorage daten werden zurückgesetzt.</p>"
                +"<button onclick='app_reset()'>Unwiederruflich Zurücksetzen</button>"
            +"<h3>Cache leeren</h3>"
                +"<p>Wird ein hoher Speicherplatzverbrauch bemerkt, kann es sich lohnen den cache manuell zu leeren. Aktueller Verbrauch: <span class='show_cache_size'></span></p>"
                +"<button onclick='cache_reset()'>Cache Leeren</button>"
        +"</div>"
        +"<div>"
            +"<h2>Updates</h2>"
            +"<div>Zu einigen Updates sind keine genauen Angaben verf&uuml;gbar.</div>"
                +"<ul id='updatelist'></ul>"
            +"</div>"
        +"<div>"
            +"<h2>Verlauf</h2>"
            +"<p>Hier wird der gesammte Verlauf aufgelistet. Auch die Namen von Elementen, die nicht geladen werden können sind aufgelistet."
            +"<ul id='n_s_verlauf'></ul>"
            +"<button onclick='deleteHistory(`ALL`);services_html_script();'>Verlauf Löschen</button>"
        +"</div>"
        +"<div>"
            +"<h2>Zuk&uuml;nftige 	&Auml;nderungen:</h2>"
            +"<p>Diese Funktionen und 	&auml;nderungen werden in k&uuml;nftigen Versionen hinzugef&uuml;gt:</p>"
            +"<ul>"
                +"<li><b>Audioquellen Support</b> (bereits in Arbeit)</li>"
                +"<li>Favoriten</li>"
                +"<li>Suchfilter</li>"
                +"<li>Ergebnislinks Sortieren (Überschriften)"
                +"<li>Audio Support</li>"
                +"<li>IOS bugfixes</li>"
            +"</ul>"
        +"</div>"
        +"</div>";
}

function services_html_script(){
    show_cache_size(document.getElementsByClassName("show_cache_size")[0]);
    document.getElementById("n_s_li").checked = luckyapp_core.page_config.settings.loading_info;
    document.getElementById("n_s_fid").checked = luckyapp_core.page_config.settings.showData;
    if(localStorage.getItem("nasa_history")){
        document.getElementById("n_s_verlauf").innerHTML = "";
        JSON.parse(localStorage.getItem("nasa_history")).forEach(async element => {
            //console.log(await get_data("https://images-api.nasa.gov/search?nasa_id="+ element));
            /*var data = await get_data("https://images-api.nasa.gov/search?nasa_id="+ element);
            console.log(data.collection.items[0]);*/
            var data = "https://images-api.nasa.gov/search?nasa_id="+ element;
            data = "`"+ data +"`";
            document.getElementById("n_s_verlauf").innerHTML += "<li onclick='flyin_close();info_open("+ data +",0, undefined, true)'>"+ element +"</li>";
        });
    }
}

function services_start(){
    var s_updatelist = luckyapp_core.modules.updates.updatelists.luckyapp.list.content;
    luckyapp_core.page_config.version = s_updatelist[0].id;
    //console.log(luckyapp_core);
    var version_display = document.getElementById("version_display");
    version_display.innerHTML = "Version: "+ luckyapp_core.page_config.version;
    version_display.addEventListener("click", services_open);
}

async function services_open(){
    services_html_change();
    await flyin_open(services_html);
    services_html_script();
    load_updatelist(updatelist_luckyapp.content, "Luckyapp");
}

function settings_init(){
    var settings_version = 2;
    if(localStorage.getItem("Nasa_settings")){
        if(settings_version > JSON.parse(localStorage.getItem("Nasa_settings")).settings_version){
            localStorage.removeItem("Nasa_settings");
            settings_init();
        }
        luckyapp_core.page_config.settings = JSON.parse(localStorage.getItem("Nasa_settings"));
    }else{
        luckyapp_core.page_config.settings = { //standard settings
            settings_version: settings_version,
            preview_img:"thumb.jpg",
            preview_mp4:"preview.mp4",
            loading_info: true,
            showData: true
        }
        localStorage.setItem("Nasa_settings", JSON.stringify(luckyapp_core.page_config.settings));
    }
}

function settings_change(input){
    if(input.id == "n_s_pi"){
        luckyapp_core.page_config.settings.preview_img = input.value;
    }else if(input.id == "n_s_pv"){
        luckyapp_core.page_config.settings.preview_mp4 = input.value;
    }else if(input.id == "n_s_li"){
        luckyapp_core.page_config.settings.loading_info = input.checked;
    }else if(input.id == "n_s_fid"){
        luckyapp_core.page_config.settings.showData = input.checked;
    }
    localStorage.setItem("Nasa_settings", JSON.stringify(luckyapp_core.page_config.settings));
    info_show("Einstellungen gespeichert.","success");
}

async function settings_reset(){
    if(localStorage.getItem("Nasa_settings")){
        localStorage.removeItem("Nasa_settings");
    }
    settings_init();
    flyin_close();
    setTimeout(()=>{
        document.getElementById("version_display").click();
    },parseFloat(window.getComputedStyle(version_history_container).animationDuration) * 1000 + 10);
}

async function cache_reset(){
    caches.delete("dynamic-v1");
    info_show("Cache geleert.");
}

async function app_reset(){
        //localStorage.clear();
        localStorage.removeItem("Nasa_settings");
        localStorage.removeItem("n_updates_index");
        localStorage.removeItem("cookies");
        location.reload(true);
}

var test, entries = [], cacheSize = 0, notCounted = [], cache_calc_state;

async function show_cache_size(elem){
    var cache = await get_cache_size(true);
    elem.innerHTML = cache.size;
}

async function get_cache_size(extended){
    entries = [];
    cacheSize = 0;
    notCounted = [];
    cache_calc_state;
    cache_calc_state = false;
    queryCache();
    var loop_break = false;
    for(h=0;loop_break == false;h++){
        if(cache_calc_state == true){
            loop_break = true;
            if(extended){
                return {
                    size: byteConverter(cacheSize),
                    notIncluded: notCounted.length,
                    notIncludedFiles: notCounted
                };
            }else{
                return byteConverter(cacheSize);
            }
        }else{
            await sleep(100);
        }
    }
    
}

function queryCache(){
    var url = [];
    caches.open('dynamic-v1').then(function (cache){
        cache.keys().then(function(keys){
            return Promise.all(
                    keys.map(function(k){url.push(k.url); return k.url} )
                )
        }).then(function(u){ cacheList(url);})
    })
}

async function cacheList(Items)
{    for(var i = 0; i < Items.length; i++){
        await fetching(Items[i]);
    }
    cache_calc_state = true;
}

async function fetching(url){
    await fetch(url, {cache: "force-cache"})
    .then((response) => {
        if(response.headers.get("content-length") != null){
            cacheSize += parseInt(response.headers.get("content-length"));
        }else{
            notCounted.push(url);
        }
    })
    .catch(function(error) {
        console.error("Fetch error");
    });;
}

function byteConverter(B){
    var KB = B / 1024;
    var MB = KB / 1024;
    if(MB < 1){
        return extround(KB, 100) +" KB";
    }else{
        return extround(MB, 100) +" MB";
    }
}

function extround(zahl,n_stelle) {
    zahl = (Math.round(zahl * n_stelle) / n_stelle);
        return zahl;
    }