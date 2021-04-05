import {
    LiveProvider,
    LiveEditor
} from 'react-live';
import dracula from 'prism-react-renderer/themes/dracula';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';


function resolveValidityIcon(valid) {

    if (valid === true) {
        return (<CheckCircleIcon style={{
            color: "#4DB14D",
            display: "block",
            margin: "0 0 10  auto"
        }} />);
    } else if (valid === false) {
        return (<ErrorIcon style={{
            color: "#FF0000",
            display: "block",
            margin: "0 0 10  auto"
        }} />);
    }
}

export default function CodeSnippet(props) {

    return (
        <div>
            {resolveValidityIcon(props.valid)}
            <LiveProvider code={props.code} language={'html'} theme={dracula}>
                <div style={{overflow: 'auto', 'height': props.height || "700px" }} >
                    <LiveEditor disabled={!props.enabled || false} onChange={(e) => props.onSvgTextChanged(e)}/>
                </div>
            </LiveProvider>
        </div>
    );
}

