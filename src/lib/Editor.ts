import { CanvasTextMetrics, Container, Text, TextStyle, Graphics, Ticker} from "pixi.js"
import { Document, Word } from "./Document"

export class Editor extends Container{

    document : Document
    caretContainer : Container = new Container()
    ticker = Ticker.shared;
    constructor(document : Document){
        super()
        this.document = document;
        this.addChild(this.caretContainer)
        this.label = "editor"
    }

    getTextMetrics(word : Word) {
        return CanvasTextMetrics.measureText(word.text, word.style);
    }

    getCaretPositionInfo(_x : number, _y : number){
        const {y , line, index, label} = this.getCaretYPosition(_y);
        const {x , char, word, char_index, char_label, char_y } = this.getCaretXPosition(_x, line);

        return {
            x : x,
            y : y,
            line : line,
            word : word,
            index : index,
            char_index : index,
            char_y : char_y
        }
        

    }
    
    getCaretXPosition(_x : number, line : Word[]){
       
        let total = 0;
        let selectedWord;
        let heightProperty = {maxHeight : 0, maxDescent : 0};
        let char_y = 0;
        /* find biggest height in each word */
        for(let word in line){
            const metrics = this.getTextMetrics({text : line[word].text, style : line[word].style})
            heightProperty.maxHeight = Math.max(heightProperty.maxHeight, metrics.height)
            heightProperty.maxDescent = Math.max(heightProperty.maxDescent,metrics.fontProperties.descent)
        }

        let label = ""
        for(let word in line){
            const word_metrics = this.getTextMetrics(line[word])
            const word_width = word_metrics.width;
            if(total + word_width >= _x){
                char_y = (heightProperty.maxHeight - heightProperty.maxDescent) - (word_metrics.height - word_metrics.fontProperties.descent)
                selectedWord = line[word];
                label = word;
                break;
            }
            total += word_width
        }
      
        let i = 0;
        let x = 0;

        for(; i < selectedWord.text.length; ++i){
   
            var charWidth = this.getTextMetrics({text : selectedWord.text[i], style : selectedWord.style}).width;
        
            if(total + charWidth >= _x){
                if(_x >= total + (charWidth / 2)){
                    x = total + charWidth;
                    
                    if(selectedWord[i + 1] === undefined){
                        i = 0;
                        selectedWord = line[Number(label) + 1]
                        char_y = (heightProperty.maxHeight - heightProperty.maxDescent) - (this.getTextMetrics(line[Number(label) + 1]).height - this.getTextMetrics(line[Number(label) + 1]).fontProperties.descent)
                    }
                    else{
                        i += 1
                    }
                    break;
                }
                else{
                    x = total;
                    console.log(i)
                    break;
                } 
            } 
            total += charWidth;
        }

        return {
            x : x,
            char : selectedWord[i],
            word : selectedWord,
            char_y : char_y,
            char_index : i,
            char_label : String(i)
        }
    }

    getCaretYPosition(_y : number){

        let total_height = 0;
        let lines = this.document.getLines();
        let i = 0
        for(; i < lines.length; ++i){
            let maxHeight = 0;
            lines[i].forEach(word => {
                 maxHeight = Math.max(maxHeight, CanvasTextMetrics.measureText(word.text, word.style).height);
            })
            
            if(total_height + maxHeight >= _y) { break }     
            
            total_height += maxHeight
        }

        return {
            y : total_height,
            line : lines[i],
            index : i,
            label : String(i)
        }
    }
    drawCaret(x : number, y : number) {
        if(this.caretContainer.children.length > 0){
           this.caretContainer.removeChildAt(0)
        } 

        const caretPosition = this.getCaretPositionInfo(x ,y )

        const char_metrics = this.getTextMetrics({text : caretPosition.word[caretPosition.char_index], style : caretPosition.word.style})
           
        const caret = new Graphics().rect(caretPosition.x, caretPosition.y + caretPosition.char_y, 1, char_metrics.height).fill({color : "black"});
        
        caret.label = "caret"
   
        this.caretContainer.addChild(caret)
    
        /* no need for another hassle of creating custom ticker function or using animated sprite... */
        setInterval(()=>{ 
            caret.visible ? caret.visible = false : caret.visible = true    
        }, 500)

    }

    drawLines() : void {
        let lineHeight = 0;
        let maxHeight = 0;
        let maxDescent = 0;
      
        this.document.getLines().forEach(line => {
            
            lineHeight += maxHeight
            let totalWidth = 0
           
            line.forEach(word => {
                if(maxHeight < CanvasTextMetrics.measureText(word.text, word.style).height){
                    maxHeight = CanvasTextMetrics.measureText(word.text, word.style).height
                    maxDescent = CanvasTextMetrics.measureText(word.text, word.style).fontProperties.descent
                }
            })

            line.forEach(word => { 
                const t = new Text({text : word.text, style : word.style})
                const measure = CanvasTextMetrics.measureText(word.text, word.style)
                t.x = totalWidth
                totalWidth += measure.width // + 6
                if(this.children.length !== 0){   
                    t.y = maxHeight - t.height  - maxDescent + measure.fontProperties.descent + lineHeight
                }  
                
                this.addChild(t)
       
                const box = new Graphics();
                // Red border
                box.rect(0, 0, t.width, t.height).stroke({color : "black"}); // Draw rectangle
                box.x = t.x;
                box.y = t.y;
    
            })
            
        })

    }
}