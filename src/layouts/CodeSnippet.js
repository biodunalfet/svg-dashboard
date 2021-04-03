import {
    LiveProvider,
    LiveEditor
} from 'react-live';

export default function CodeSnippet(props) {

    return (
        <div style={{background: "#000000"}}>
            <LiveProvider code={props.code} language={'html'}>
                <LiveEditor/>
            </LiveProvider>
        </div>

    );
}

