export default function ColorPreviewCircle(props) {
    let dimen = (props.dimen || 30);
    let pos = dimen/2;
    const color = props.color || '#ffffff';
    return (<svg height={dimen} width={dimen} stroke="black" strokeWidth="0.5">
        <circle cx={pos} cy={pos} r={pos - 5} fill={color} />
    </svg>);
}