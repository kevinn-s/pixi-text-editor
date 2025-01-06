import * as PIXI from 'pixi.js'

export interface Word{
    text : string,
    style : PIXI.TextStyle
}


export class Document{
    private lines : Word[][]


    constructor(){
        this.lines = [[{text : "Hello", style : new PIXI.TextStyle({fontFamily : "Times New Roman", 
            fontSize : 90})}, {text : "World", style : 
                new PIXI.TextStyle({fontSize : 20})}, {text : "And MARS", 
                    style : new PIXI.TextStyle({fontSize : 35})}], 
                    
            [{text : "Hello", style : 
                new PIXI.TextStyle({fontFamily : "Times New Roman", 
                    fontSize : 90})}, {text : "World", 
                        style : new PIXI.TextStyle({fontSize : 20})}, 
                        {text : "And MARS", style : 
                            new PIXI.TextStyle({fontSize : 35})}]
                        ]
    }

    parse(HTMLString : string) : void {
        
    }

    getLines() : Word[][] {
        return this.lines;
    }
}