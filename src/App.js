import './App.css';
import Control from "./layouts/Control";
import CodeSnippet from "./layouts/CodeSnippet";
import React, {useState} from "react";
import {Divider, Typography} from "@material-ui/core";

function App() {
    const [originSvg, setOriginSvg] = useState("");
    const [modifiedSvgCode, setModifiedSvgCode] = useState("");
    const [templatedSvgCode, setTemplatedSvgCode] = useState("");
    const [modifiedSvg, setModifiedSvg] = useState("");

    return (
        <div className="parent">
            <div className="h-pane">
                <Control onOriginSvg={onOriginSvg}
                         onModifiedSvgCode={onModifiedSvgCode}
                         onTemplatedSvgCode={onTemplatedSvgCode}
                />
            </div>
            <div className="h-pane">
                <div>
                    <Typography style={{marginTop: "10px", marginBottom: "10px"}}>Templated svg code</Typography>
                    <CodeSnippet style={{"margin-bottom": "20px"}}
                                 code={templatedSvgCode}
                                 height="500px"
                                 onSvgTextChanged={{}}
                    />
                </div>
                <Divider style={{"marginTop": "20px", "margin-bottom": "20px"}}/>
                <Typography style={{"marginTop": "10px", "marginBottom": "10px"}}>Modified svg code</Typography>
                <CodeSnippet style={{"margin-bottom": "20px"}}
                             code={modifiedSvgCode}
                             onSvgTextChanged={{}}
                />
            </div>
            <div className="h-pane">
                <div className="v-pane">
                    <Typography style={{"margin": "10px"}}>Templated svg</Typography>
                    <img src={modifiedSvg} style={{width: "100%", display: "block", margin: "auto"}} alt={""}/>
                </div>
                <div className="v-pane">
                    <img src={originSvg} style={{width: "100%", display: "block", margin: "auto"}} alt={""}/>
                </div>
            </div>
        </div>
    );

    function onModifiedSvgCode(svgCode) {
        setModifiedSvgCode(svgCode)
        setModifiedSvg(svgToUrl(svgCode));
    }

    function onTemplatedSvgCode(svgCode) {
        setTemplatedSvgCode(svgCode)
    }

    function onOriginSvg(svg) {
        setOriginSvg(svgToUrl(svg));
    }

    function svgToUrl(svg) {
        let blob = new Blob([svg], {type: 'image/svg+xml'});
        return URL.createObjectURL(blob);
    }
}

export default App;
