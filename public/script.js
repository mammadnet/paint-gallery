
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
        img.src = `${info.iiifurl}/full/1000,/0/default.jpg`
        const div = document.createElement("div");
        div.classList.add('tall')
        div.appendChild(img);
        imageContainer.appendChild(div);
    })
}

