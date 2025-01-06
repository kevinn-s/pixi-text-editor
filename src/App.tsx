import React, {useEffect, useRef} from 'react';
// import logo from './logo.svg';
import './App.css';
// import { Editor } from './lib/Editor.ts';
import { Container, Application, Color } from 'pixi.js';
import { Document } from './lib/Document.ts';
import { Editor } from './lib/Editor.ts';


export const App = () => {
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
  
    const document = new Document();
    const editor = new Editor(document);
    const app = new Application();
  
    const init = async () => {
        await app.init({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: new Color("white")
           
          })
        
          if(viewportRef.current !== null){
            if(!viewportRef.current.hasChildNodes()){
                viewportRef.current.appendChild(app.canvas)      
            }
        }
        editor.drawLines();
        app.stage.addChild(editor)
        // editor.drawCaret(0, 0)
        // console.log(app.stage.children)
        app.stage.interactive = true
        app.stage.addEventListener("mousedown", (e) => {
          editor.drawCaret(e.x, e.y)        

        })

    }

    init();
 
  }, []);

  return <div ref={viewportRef} style={{ width: "100%", height: "100%" }} />;
};


export default App