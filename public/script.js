
const imageContainer = document.querySelector(".grid-wrapper")
const imgIncrease = 80;
let lastNumid = 0;

async function getData(lastNumid=0, number=10, classification =''){
    const APIurl = new URL("https://paint.iran.liara.run")

    APIurl.searchParams.append("lastNumid", lastNumid);
    APIurl.searchParams.append("number", number);
    APIurl.searchParams.append("classification", classification);

    const response = await fetch(APIurl);
    const data = await response.json();
    return data;
}


async function imgAppend(data){
    data.forEach(info => {
        const img = new Image();
        img.src = `${info.iiifurl}/full/!1000,1000/0/default.jpg`
        img.addEventListener('load', ()=>{
            const div = document.createElement("div");
            const className = sizeDescription(info);
            div.classList.add(className)
            div.appendChild(img);
            imageContainer.appendChild(div);
        })
    })
}

getData(34, 400);

function sizeDescription(info){         // Return size (small, big, wide, tall) of image
    if(info.medium.includes('tempera') && info.medium.includes('panel')) return 'small';
    if(info.realwidth / info.realheight < 0.9) return 'tall';
    else if(info.realwidth  / info.realheight > 2.1) return 'wide';
    else return info.classification === 'Drawing' ? 'small' : 'big';


}


let throttleCheck;
function throttle(cb, time){
    if(throttleCheck) return;

    throttleCheck = true;
    setTimeout(()=>{
        cb();
        throttleCheck = false;
    }, time)
}

async function handelInfiniteScroll(){
    const endOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
    if(endOfPage){
        throttle(async ()=>{
            console.log('fuck1');
            const data = await getData(lastNumid, imgIncrease)
            lastNumid = data.lastNumid+1;
            console.log(lastNumid)
            imgAppend(data.images);
        }, 1000)
    }
}


    window.addEventListener('scroll',handelInfiniteScroll);