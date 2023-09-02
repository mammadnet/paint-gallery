
const imageContainer = document.querySelector(".grid-wrapper")

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
        const img = document.createElement("img");
        img.src = `${info.iiifurl}/full/!1000,1000/0/default.jpg`
        const div = document.createElement("div");
        const className = sizeDescription(info);
        div.classList.add(className)
        div.appendChild(img);
        imageContainer.appendChild(div);
    })
}

getData(34, 400);

function sizeDescription(info){         // Return size (small, big, wide, tall) of image
    // if(info.height + info.width === 0) return 'small';
    if(info.width / info.height < 0.9) return 'tall';
    else if(info.width  / info.height > 2.1) return 'wide';
    else return info.classification === 'Drawing' ? 'small' : 'big';


}


setTimeout(async ()=> {                          // ---> TEMP <---
    const data = await getData(40, 60);
    imgAppend(data.images);
}, 1000)