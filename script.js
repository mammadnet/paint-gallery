const imageContainer = document.querySelector(".grid-wrapper");
const imgIncrease = 80;
let lastNumid = 0;
const THUMB_WIDTH = 600; // Max thumb width
const THUMB_HEIGHT = 600; // Max thumb height

const classificationSwitch = document.querySelector('.tgl');
let classification = classificationSwitch.checked ? 'Drawing' : 'Painting';

async function getData(lastNumid = 0, number = 10, classification = "") {
    const APIurl = new URL("https://paint.iran.liara.run");

    APIurl.searchParams.append("lastNumid", lastNumid);
    APIurl.searchParams.append("number", number);
    APIurl.searchParams.append("classification", classification);

    const response = await fetch(APIurl);
    const data = await response.json();
    return data;
}

function imgSrc(url, width, height) {
    return `${url}/full/!${width},${height}/0/default.jpg`;
}

async function imgAppend(data) {
    data.forEach((info) => {
        const img = new Image();
        img.src = imgSrc(info.iiifurl, THUMB_WIDTH, THUMB_HEIGHT);
        img.addEventListener("click", () =>
            openPopup(imgSrc(info.iiifurl, 1300, 1300))
        );
        img.alt = info.title;
        img.title = info.title;
        img.addEventListener("load", () => {
            const div = document.createElement("div");
            div.setAttribute('data-classification', info.classification)
            div.classList.add('frame')
            if(info.classification === classification)
                div.classList.add('show-frame')
            else div.classList.add('hidden')
            const className = sizeDescription(info);
            div.classList.add(className);
            div.appendChild(img);
            imageContainer.appendChild(div);
        });
    });
}

getData(34, 400);

async function loadImgs() {
    console.log("loaded");
    const data = await getData(lastNumid + 1, imgIncrease);
    lastNumid = data.lastNumid;
    imgAppend(data.images);
}

function sizeDescription(info) {
    // Return size (small, big, wide, tall) of image
    if (info.medium.includes("tempera") && info.medium.includes("panel"))
        return "small";
    if (info.width / info.height < 0.9) return "tall";
    else if (info.width / info.height > 2) return "wide";
    else return info.classification === "Drawing" ? "small" : "big";
}

let throttleCheck;
function throttle(cb, time) {
    if (throttleCheck) return;

    throttleCheck = true;
    setTimeout(() => {
        cb();
        throttleCheck = false;
    }, time);
}

async function handelInfiniteScroll() {
    const endOfPage =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
    if (endOfPage) {
        throttle(() => {
            loadImgs();
            console.log(lastNumid);
        }, 1000);
    }
}

window.addEventListener("scroll", handelInfiniteScroll);

window.addEventListener("load", loadImgs);

function openPopup(src) {
    const popupImage = document.querySelector(".popupimage");
    const popupcontainer = document.querySelector(".popup-whole");

    popupImage.src = src;
    popupcontainer.classList.remove("hidden");
}

function removePopup(event) {
    const popupcontainer = document.querySelector(".popup-container");
    if (!popupcontainer.contains(event.target)) {
        const popupImage = document.querySelector(".popupimage");
        const popupWhole = document.querySelector(".popup-whole");

        popupImage.src = "";
        popupWhole.classList.add("hidden");
    }
}

function popupResize() {
    const popup = document.querySelector(".popup");
    const popupcontainer = document.querySelector(".popup-container");
    const popupWhole = document.querySelector(".popup-whole");
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    if (windowHeight / windowWidth > 1.2) {
        popupcontainer.style.height = "unset";
        popupcontainer.style.maxWidth = "90%";
    } else {
        popupcontainer.style.height = "96%";
        popupcontainer.style.maxWidth = "70%";
    }
}

window.addEventListener("load", popupResize);

window.addEventListener("resize", popupResize);

popupWhole = document.querySelector(".popup-whole");
popupWhole.addEventListener("click", removePopup); // Check clicking of outside of popup


function closeNavbar(event){
    const navbar = document.querySelector('.navbar')

    if(!navbar.contains(event.target)){
        const navButton = document.querySelector(".nav-button");
        navButton.checked= false;
    }
    
}

    
window.addEventListener('click', closeNavbar)


function setImageClass(classification){
    const frames = document.querySelectorAll('.frame')
    frames.forEach(f => {
        if(f.getAttribute('data-classification') === classification){
            f.classList.remove('hidden');
            f.classList.add('show-frame')
        }
        else{
             f.classList.add('hidden')
            f.classList.remove('show-frame');

            }
    })
}


classificationSwitch.addEventListener('change', ()=>{
    window.scrollTo(0, 0)
    if(classificationSwitch.checked){
        classification = 'Drawing'
    }else{
        classification = 'Painting'
    }
    setImageClass(classification);
})
