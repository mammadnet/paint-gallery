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
