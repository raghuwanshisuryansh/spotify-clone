let currentSong = new Audio();
let songs;
let currFolder;

// function for conver second into minute : second
function formatTime(seconds) {
    // Handle invalid values
    if (!seconds || isNaN(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedSeconds =
        remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

    return `${minutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/`);
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}`)[1]);
        }

    }

    // select each  song in list
    let songUl = document.querySelector('.songList').getElementsByTagName('ul')[0];
    songUl.innerHTML = "";
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + ` 
                            <li>
                            <div class="playBox">
                                <img class="svgicon" src="svg/music.svg" alt="">
                                <div class="musicDetail">
                                    <div class="musicName">${decodeURIComponent(song)}</div>
                                    <div class="singername">Surya</div>
                                </div>
                                <div class="playNow">
                                    <div>Play now</div>
                                    <img class="svgicon" src="svg/play.svg" alt="">
                                </div>
                            </div>
                             </li>`;
    }

    // add event listner at each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener('click', element => {
            console.log(e.querySelector(".musicDetail").firstElementChild.innerHTML);
            playMusic(e.querySelector(".musicDetail").firstElementChild.innerHTML.trim());
        })
    });

    return songs;
}

// play music
let playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/"+ track);
    currentSong.src = `/songs/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "svg/pause.svg";
    }
    document.querySelector(".songInfo").innerHTML = decodeURIComponent(track).replace(".mp3", "");
    document.querySelector(".songTime").innerHTML = "00:00"
}

async function displayAlbumb() {
    let cards = document.querySelector(".cards")
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let anchors = div.getElementsByTagName('a');

    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes('songs')) {
            let folder = e.href.split("5C").slice(-1)[0].replace("/", "")
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response = await a.json();
            cards.innerHTML = cards.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg width="30" height="30" viewBox="0 0 24 24">
                                <path
                                    d="M7.05 3.606 20.54 11.394a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"
                                    fill="#000" />
                            </svg>
                        </div>
                        <img src= "/songs/${folder}/cover.webp" alt="">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`
        }
    }

    // event when card is clicked open folder
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener('click', async item => {
            console.log(item.target)
            songs = await getSongs(`${item.currentTarget.dataset.folder}`);
            console.log(songs)
            playMusic(songs[0]);
        })
    })

}

async function main() {

    await getSongs("bollywoodhits");
    playMusic(songs[0], true);

    // display all the folder(albumb) in card
    displayAlbumb();

    // attach an event listner play , pause , next , privious
    // play priviou next is a id of buttons
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "svg/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "svg/play.svg"
        }
    })

    //listen for time update event

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTime").innerHTML = `${formatTime(currentSong.currentTime)}/
                                                          ${formatTime(currentSong.duration)}`;

        //seekbar
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // add event listner at seekbar

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";

        currentSong.currentTime = (currentSong.duration * percent) / 100;

    })

    // add event listner at hammburger

    document.querySelector(".hammburger").addEventListener("click", () => {
        document.querySelector(".leftBox").style.left = "0";
    })

    document.querySelector(".cancel").addEventListener("click", () => {
        document.querySelector(".leftBox").style.left = "-120%";
    })
    // add event listner at hammburger2
    const rightNav = document.querySelector('.rightNav');
    const ham = document.querySelector('.hammburger2');
    const cross = document.querySelector('.cancel2');

    ham.addEventListener('click', () => {
        rightNav.classList.add('active');
    });

    cross.addEventListener('click', () => {
        rightNav.classList.remove('active');
    });


    // add event listner at privious and next button
    // privious.addEventListener("click",()=>{
    //     currentSong.pause()
    //     console.log("privious click")
    //     let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    //     console.log(index-1)
    //     if((index-1)>=0){
    //         playMusic(songs[index-1])
    //     }
    // })
    // next.addEventListener("click",()=>{
    //     currentSong.pause()
    //     console.log("next click")
    //     let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    //     console.log(index+1)
    //     if((index+1)<songs.length){
    //         playMusic(songs[index+1])
    //     }
    // })

    // previous
    privious.addEventListener("click", () => {
        currentSong.pause();
        console.log("previous click");

        // FIX: clean current song name
        let currentName = currentSong.src.split("/").pop().replace("%5C", "");

        // FIX: find correct index
        let index = songs.findIndex(s => s.includes(currentName));

        console.log(index - 1);

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    // next
    next.addEventListener("click", () => {
        currentSong.pause();
        console.log("next click");

        // FIX: clean current song name
        let currentName = currentSong.src.split("/").pop().replace("%5C", "");

        // FIX: find correct index
        let index = songs.findIndex(s => s.includes(currentName));

        console.log(index + 1);

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    });


    // add event at volume

    document.querySelector(".volumeButton").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(parseInt(e.target.value) / 100)
        currentSong.volume = parseInt(e.target.value) / 100;
    })

    //  add event listner to mute volume 
    document.querySelector(".volumeButton>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".volumeButton").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = .10;
            document.querySelector(".volumeButton").getElementsByTagName("input")[0].value = 10;
        }
    })
}

main();

