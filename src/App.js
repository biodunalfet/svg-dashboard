import './App.css';
import Control from "./layouts/Control";
import SampleSvg from "./layouts/sampleSvg.svg"
import CodeSnippet from "./layouts/CodeSnippet";

function App() {
    return (
    <div className="parent">
      <div className="h-pane">
        <Control/>
      </div>
        <div className="h-pane">
            Modified svg code
            <CodeSnippet />
        </div>
        <div className="h-pane">
          <div className="v-pane">
              Templated svg
          </div>
          <div className="v-pane">
              <img src={SampleSvg} style={{height: "100%", display: "block", margin:"auto"}}/>
          </div>
      </div>
    </div>
  );
}

export default App;
