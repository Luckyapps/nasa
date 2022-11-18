async function start_window_bar_stylesheet(){
    if(luckyapp_core.modules.content.loaded){
        var html_content = "<div id='control_bar'><div>Du hast die geheime window_bar entdeckt!!!!</div></div>";
        html_content = await createHTML(html_content);
        document.body.appendChild(html_content);
        if ('windowControlsOverlay' in navigator) {
            navigator.windowControlsOverlay.addEventListener('geometrychange', (event) => {
            if (event.visible) {
                const rect = event.titlebarAreaRect;
                document.getElementById("control_bar").style.display = "flex";
                console.log(rect);
                // Do something with the coordinates of the title bar area.
            }else{
                console.log(invisible);
                document.getElementById("control_bar").style.display = "none";
            }
            });
        }else{
            console.log("no windowcontrolsoverlay");
        }
    }else{
        await sleep(1);
        start_window_bar_stylesheet();
    }
    luckyapp_core.modules.window_bar.loaded = true;
}