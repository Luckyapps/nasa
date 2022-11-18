var output;

function nasa_init(){
    output = document.getElementById("nasa_output");
    document.addEventListener("keydown",(evt)=>{
        if(evt.key == "Enter"){
            nasa_start(document.getElementById("nasa_input").value);
        }
    });
    
    document.getElementById("nasa_input_but").addEventListener("click",()=>{
        nasa_start(document.getElementById("nasa_input").value);
    });
}

async function nasa_start(subject){
    output.innerHTML = "";
    var data = await get_data("https://images-api.nasa.gov/search?q="+ subject);
    data = data.collection;
    console.log(data);
    for(i=0;i<data.items.length;i++){
        for(j=0;j<data.items[i].links.length;j++){
            if(data.items[i].links[j].render == "image"){
                output.innerHTML += "<img onclick='info_open(`"+ data.href +"`, `"+ i +"`)' src='"+ data.items[i].links[j].href +"'></img>"
            }
        }
    }
}

async function info_open(url, index){
    var data = await get_data(url);
    data = data.collection.items[index];
    console.log(data);
    flyin_open(JSON.stringify(data));
}

async function get_data(url){
    //var url = "https://www.faderstart.wdr.de/radio/radiotext/streamtitle_1live.txt";
    var data
    
    await fetch(url)
    
    .then((response) => response.text())

    .then((data_text) => {data = JSON.parse(data_text)});
    return data;
}