console.log("javascript for project spotify")
let currentsong = new Audio()
let songs;
let curfolder;

// this is the fucntion to update time in html 

function formatSeconds(seconds) {
    // Ensure the input is an integer
    const totalSeconds = Math.floor(seconds);

    // Calculate minutes and seconds
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    // Format minutes and seconds with leading zeros
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    // Return formatted time in "MM:SS" format
    return `${formattedMinutes}:${formattedSeconds}`;
}


// we take songs in other file using atech this songs file using fetch  and async await function 
async function getsongs(folder) {
    curfolder = folder
    let a = await fetch(`/songs/${folder}`)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let all_aWithhf = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < all_aWithhf.length; index++) {
        const element = all_aWithhf[index]
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
        
    }
    // call we songs array that we create and get all songs list laibrary
    let songul = document.querySelector(".songslist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {

        songul.innerHTML = songul.innerHTML + `  <li>
        <img class="invert" src="https://cdn.hugeicons.com/icons/music-note-03-stroke-rounded.svg" alt="music-note-03" width="22" height="22">
        <div class="songinfo">
        <div> ${song.replaceAll("%20", " ")}</div>
        <div>harshit</div>
        </div>
        <div class="playnow">
        <span>Play Now</span>
        
        <img class="invert" src="https://cdn.hugeicons.com/icons/play-circle-02-stroke-rounded.svg" alt="play-circle-02" width="28" height="28">
        </div>
        </li>`
        
        
        
    }
    
    // attach an event listener to each song 
    
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e => {
        
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".songinfo").firstElementChild.innerHTML.trim())
            playmusic(e.querySelector(".songinfo").firstElementChild.innerHTML.trim())
        })
    })
    
    return songs;
}
const playmusic = (track, pause = false) => {
    // let audio = new Audio("//songs/" + track)

    currentsong.src = `/songs//${curfolder}/` + track
    let play = document.querySelector(".playbtn");
    if (!pause) {

        currentsong.play()
        play.src = "img/pause.svg"
    }

    document.querySelector(".songinfobar").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}
async function displayalbum() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    // console.log(div)
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]

        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split('/').splice(-3)[2]
            //    console.log(folder)
            //    get the metadata of folder using json 
         let a = await fetch(`/songs/${folder}//info.json`)
            let response = await a.json();
            // console.log(response)
            cardcontainer.innerHTML = cardcontainer.innerHTML + ` <div data-folder="${folder}"  class="card">
        <div class="playforimg">
            <!-- Outer div with a green background to contain the play icon -->

            <!-- Play circle SVG with no border/outline and a black play button -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="30"
                height="30">
                <!-- No outline/border on this circle -->
                <circle cx="12" cy="12" r="10" fill="none" stroke="none"></circle>
                <!-- Black play triangle -->
                <polygon points="10 8 16 12 10 16" fill="black"></polygon>
            </svg>
        </div>


        <img src="/songs/${folder}/cover.jpg" alt="">
        <h4>${response.singer}</h4>
        <p>${response.Artist}</p>
    </div>`
        }

    }

    // when we click to onther card so our playlist change means other card always new songs store and difrent card have self new songs 
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            // console.log(item.currentTarget.dataset)
            songs = await getsongs(`${item.currentTarget.dataset.folder}`)
            playmusic(songs[0])
        })
    })

}
async function main() {
    // list of all songs
    await getsongs(`ncs`)
    playmusic(songs[0], true)
    // console.log(songs)

    displayalbum()



    // we use hare event of playbar play next and previous 
    let play = document.querySelector(".playbtn");
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg"
        }
    })

    //   now in this we update our time of song that show in playbar

    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime,currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${formatSeconds(currentsong.currentTime)}/${formatSeconds(currentsong.duration)
            }`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    // we add event listener on play seekbar 
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = (currentsong.duration) * percent / 100



    })

    // hare we add event click for our hamburger 
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // add event click for close hamburger 
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // add event for our song pre or next button in bar 

    // this is the previous for event 

    previous.addEventListener("click", (e) => {
        currentsong.pause()
        let index = songs.indexOf(currentsong.src.split('/').slice(-1)[0])


        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })
    // this is the next event for song 
    next.addEventListener("click", () => {
        currentsong.pause()

        let index = songs.indexOf(currentsong.src.split('/').slice(-1)[0])

        if ((index + 1) < songs.length) {

            playmusic(songs[index + 1])
        }


    })

    // this is the event for our song volume up and down 
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log(e, e.target, e.target.value)
        currentsong.volume = parseInt(e.target.value) / 100

    })


    // in this we add event listener for our volume mute 
    document.querySelector(".volume>img").addEventListener("click", e => {
        // console.log(e.target)
        if (e.target.src.includes("https://cdn.hugeicons.com/icons/volume-high-stroke-rounded.svg")) {
            e.target.src = e.target.src.replace("https://cdn.hugeicons.com/icons/volume-high-stroke-rounded.svg", "https://cdn.hugeicons.com/icons/volume-off-stroke-rounded.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0

        }
        else {
            e.target.src = e.target.src.replace("https://cdn.hugeicons.com/icons/volume-off-stroke-rounded.svg", "https://cdn.hugeicons.com/icons/volume-high-stroke-rounded.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10

        }
    })


}

main()