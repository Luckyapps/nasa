function startAudio(){
}

var sources = {
    list: {
        wdr2:{
            name:"WDR2",
            description:"WDR2 Popsender",
            source:"https://wdr-wdr2-suedwestfalen.icecastssl.wdr.de/wdr/wdr2/suedwestfalen/mp3/128/stream.mp3",
            main: true,
            radiotext_url: "https://www.wdr.de/radio/radiotext/streamtitle_wdr2.txt",
            type: "radio",
            image: {
                src: "https://luckyapps.github.io/Musik/media/images/wdr2.png",
                sizes: "400x400",
                type: "image/png"
            }
        },
        wdr3:{
            name:"WDR3",
            description:"Klassik und Kultur",
            source:"https://wdr-wdr3-live.icecastssl.wdr.de/wdr/wdr3/live/mp3/128/stream.mp3",
            radiotext_url: "https://www.wdr.de/radio/radiotext/streamtitle_wdr3.txt",
            type: "radio",
            image: {
                src: "https://luckyapps.github.io/Musik/media/images/wdr3.png",
                sizes: "448x448",
                type: "image/png"
            }
        },
        wdr4:{
            name:"WDR4",
            description:"Oldies",
            source:"https://wdr-wdr4-live.icecastssl.wdr.de/wdr/wdr4/live/mp3/128/stream.mp3",
            radiotext_url: "https://www.wdr.de/radio/radiotext/streamtitle_wdr4.txt",
            type: "radio",
            image: {
                src: "https://luckyapps.github.io/Musik/media/images/wdr4.png",
                sizes: "180x180",
                type: "image/png"
            }
        },
        loop1:{
            name: "LOOP1",
            desciption: "Ein Loop für zwischendurch.",
            source: "audio/LOOP 1.wav",
            type: "audio/wav"
        }
    }
}

class audioObject{
    constructor(source,name,desciption,type,image){
        this.source = source;
        this.name = name;
        this.desciption = desciption;
        this.type = type;
        this.image = image;
    }
}

var player = {
    currentAudio: {},
    audioPlaying: false,
    playbuttons: [],
    audioList: {
        audios: sources.list,
        keylist: Object.keys(sources.list)
    },
    add: function(id, source, data){
        this.audioList.keylist.push(id);
        this.audioList.audios[id] = new audioObject(source,data.name,data.desciption,data.type,data.image);
        resetPlaybuttons();
        loadPlaybuttons();
    },
    check: function(id){
        for(i=0;i<this.audioList.keylist.length;i++){
            if(this.audioList.keylist[i] == id){
                return true;
            }
        }
        return false;
    },
    play: function(audio_id){
        if(!player.audioList.audios[audio_id].audio){
            player.audioList.audios[audio_id].audio = new Audio(player.audioList.audios[audio_id].source);
            //player.audioList.audios[audio_id].audio.play();
            player.audioList.audios[audio_id].audio.addEventListener("play", (evt)=>{player.audioPlaying = true;if(player.audioList.audios[audio_id].buttons){playbuttons.update(player.audioList.audios[audio_id].buttons);}});
            player.audioList.audios[audio_id].audio.addEventListener("pause", (evt)=>{player.audioPlaying = false;if(player.audioList.audios[audio_id].buttons){playbuttons.update(player.audioList.audios[audio_id].buttons);}});
            player.audioList.audios[audio_id].audio.addEventListener("ended", (evt)=>{player.audioPlaying = false;if(player.audioList.audios[audio_id].buttons){playbuttons.update(player.audioList.audios[audio_id].buttons);}});
            //player.audioList.audios[audio_id].audio.addEventListener("timeupdate", (evt)=>{console.log(evt.target)});
        }
        var audio = player.audioList.audios[audio_id].audio;
        if(player.audioList.audios[audio_id].type == "radio"){
            audio.src = audio.src;
        }
        audio.play();
        this.audioPlaying = true;
        this.currentAudio = player.audioList.audios[audio_id];
        this.currentAudio.id = audio_id;
        if(player.audioList.audios[audio_id].buttons){
            playbuttons.update(player.audioList.audios[audio_id].buttons);
        }
        loadMediaInterface(audio_id);
    },
    pause: function(audio_id){
        var audio = player.audioList.audios[audio_id].audio;
        audio.pause();
        this.audioPlaying = false;
        if(player.audioList.audios[audio_id].buttons){
            playbuttons.update(player.audioList.audios[audio_id].buttons);
        }
    },
    toggle: function(audio_id){
        if(this.audioPlaying){
            if(audio_id == this.currentAudio.id){
                this.pause(audio_id);
            }else{
                this.pause(this.currentAudio.id);
                this.play(audio_id);
            }
        }else{
            this.play(audio_id);
        }
        try{
            refreshPlaybar(player.currentAudio);
        }
        catch{
            console.log("RefreshPlaybar nicht gesetzt oder keine Playbar vorhanden.");
        }
        console.log(player);
    }
}

var playbuttons = {
    update: function(buttons){
        for(i=0;i<buttons.length;i++){
            if(player.audioPlaying){
                buttons[i].innerHTML = "||";
            }else{
                buttons[i].innerHTML = ">";
            }
        }
    }
}

function loadPlaybuttons(){
    var playbuttons = document.getElementsByClassName("playbutton");
    for(i=0;i<playbuttons.length;i++){
        if(playbuttons[i].getAttribute("data-audio")){
            for(j=0;j<player.audioList.keylist.length;j++){ 
                if(playbuttons[i].getAttribute("data-audio") == player.audioList.keylist[j]){ //Wenn es für data-audio ein Audioelement gibt.
                    player.playbuttons.push(playbuttons[i]);
                    if(player.audioList.audios[player.audioList.keylist[j]].buttons){
                        player.audioList.audios[player.audioList.keylist[j]].buttons.push(playbuttons[i]);
                    }else{
                        player.audioList.audios[player.audioList.keylist[j]].buttons = [playbuttons[i]];
                    }
                }
            }
        }
    }
    for(i=0;i<player.playbuttons.length;i++){
        player.playbuttons[i].addEventListener("click",playbuttonclickeventlistener);
    }
    console.log(player);
}
function playbuttonclickeventlistener(evt){player.toggle(evt.target.getAttribute("data-audio"))};//für Playbuttons eventlistener

function resetPlaybuttons(){
    for(i=0;i<player.playbuttons.length;i++){
        player.playbuttons[i].removeEventListener("click", playbuttonclickeventlistener);
    }
    player.playbuttons = []; //Playbuttons zurücksetzen
    for(i=0;i<player.audioList.keylist.length;i++){
        if(player.audioList.audios[player.audioList.keylist[i]].buttons!=undefined){
            player.audioList.audios[player.audioList.keylist[i]].buttons = undefined;
        }
    }
}

function loadMediaInterface(audio_id){
    var data = player.currentAudio;

    if(audio_id){
        data = player.audioList.audios[audio_id];
    }

    var image = {src:"https://luckyapps.github.io/Musik/media/images/logo.png", sizes:"1440x1440", type: "image/png"};

    if(data.image){
        image = data.image;
    }

    if(!data.name){
        data.name = audio_id;
    }

    navigator.mediaSession.metadata = new MediaMetadata({
        title: data.name,
        artist: 'Luckyapps',
        album: 'Luckyapps Media Player',
        artwork: [
            //{ src: 'https://dummyimage.com/96x96',   sizes: '96x96',   type: 'image/png' },
            //{ src: 'https://dummyimage.com/128x128', sizes: '128x128', type: 'image/png' },
            //{ src: 'https://dummyimage.com/192x192', sizes: '192x192', type: 'image/png' },
        // { src: 'https://dummyimage.com/256x256', sizes: '256x256', type: 'image/png' },
            //{ src: 'https://dummyimage.com/384x384', sizes: '384x384', type: 'image/png' },
            //{ src: 'https://dummyimage.com/512x512', sizes: '512x512', type: 'image/png' },
            //---------------{ src: radio.current_stream.data.image.src, sizes: radio.current_stream.data.image.sizes, type: radio.current_stream.data.image.type },
            image
        ]
    });
}