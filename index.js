const http = require("node:http")
const url = require('node:url')
const mariadb = require("mariadb")
require('dotenv').config();






class Response{

    constructor(images){
            this.images= images;
            this.number= this.images.length;
            this.lastNumid= this.maxNumid();

    }

    maxNumid(){
        return this.images.reduce((acc, img) => 
                img.numid > acc ? img.numid : acc, 0);
    }

    toString(){
        return JSON.stringify(this);
    }
}

// Get data from mariadb database
async function getData(numidFrom = 0, number=6, classification = undefined){
    
    const classificationCondition = classification ? 'AND classification=' + `"${classification}"`: '';

    let query = `\
    SELECT DISTINCT numid, classification, title, iiifurl FROM data \
    WHERE (numid >= ${numidFrom} ${classificationCondition})\
    LIMIT ${number};`;

    const connection = await mariadb.createConnection({
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: 'imageInfo',
        // timeout : process.env.DATABASE_TIMEOUT_LIMIT,
        // connectionLimit:process.env.DATABASE_CONNECTION_LIMIT,
        // trace: true,
    })

    try{
        
        
        const result = await connection.query(query);
        connection.end();
        return result;

    }catch(err){
        throw err;
    }

}



async function requestListener(req, res){
    
    
    console.log("request receive")
    const {lastNumid, number, classification} = url.parse(req.url, true).query;
    
    try{
        const data = await getData(lastNumid, number, classification);
        
        
        const response = new Response(data);
        
        
        res.setHeader("Content-Type", "application/json")
        res.write(response.toString());
        res.end();
        
    }catch(err){
        console.error(err);
        res.end("something went WRONG!!!!!");
    }
}


const server = http.createServer(requestListener)

server.listen(12345, "127.0.0.1", ()=>{
    console.log("Run server");
})