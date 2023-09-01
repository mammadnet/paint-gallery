

async function getData(lastNumid=0, number=10, classification =''){
    const APIurl = new URL("https://paint.iran.liara.run")

    APIurl.searchParams.append("lastNumid", lastNumid);
    APIurl.searchParams.append("number", number);
    APIurl.searchParams.append("classification", classification);

    const response = await fetch(APIurl);
    const data = await response.json();
    return data;
}

