import React, {useEffect, useState} from "react";
import {Button, Divider, Menu, MenuItem, Snackbar, Typography} from "@material-ui/core";
import CodeSnippet from "./CodeSnippet";
import ColorVariable from "../domain/ColorVariable";
import ColorVariableList from "./ColorVariableList";
import AbsoluteColorForm from "./AbsoluteColorForm";
import RelativeColorForm from "./RelativeColorForm";
import RelativeVariable from "../domain/RelativeVariable";
import RelativeColorVariableList from "./RelativeColorVariableList";
import {parse} from 'svg-parser';
import jp from 'jsonpath'
import validateColor from "validate-color";
import Color from 'color'
import {blendAlpha, enhanceHexBy} from "../Utils";
import DetectedColorList from "./DetectedColorList";
import DeltaE from 'delta-e';
import lab from "../domain/lab";
import _ from 'lodash';
import hastUtilToHtml from 'hast-util-to-html';

export default function Control(props) {

    const [anchorElement, setAnchorElement] = useState(null);
    const [openAbsoluteColorForm, setOpenAbsoluteColorForm] = useState(false);
    const [openRelativeColorForm, setOpenRelativeColorForm] = useState(false);
    const [absoluteColorName, setAbsoluteColorName] = useState("");
    const [absoluteHexColorValue, setAbsoluteHexColorValue] = useState("");
    const [absoluteFormError, setAbsoluteFormError] = useState(null);
    const [colorVariables, setColorVariables] = useState([]);
    const [relativeVariables, setRelativeVariables] = useState([]);
    const [relativeColorName, setRelativeColorName] = useState("");
    const [relativeBaseColor, setRelativeBaseColor] = useState("");
    const [relativeIntensity, setRelativeIntensity] = useState(null);
    const [relativeFormError, setRelativeFormError] = useState(null);
    const [originSvgValid, setOriginSvgValid] = useState(undefined);
    const [suggestedColors, setSuggestedColors] = useState([]);
    const [suggestedIntensity, setSuggestedIntensity] = useState(null);
    const [toast, setToast] = useState({show: false, message: ""});
    const [relativeMimicColor, setRelativeMimicColor] = useState("");
    const [relativeFormState, setRelativeFormState] = useState(true);
    const [originalCode, setOriginalCode] = useState("");
    const [absoluteMimicColor, setAbsoluteMimicColor] = useState("");
    const [templateSvgCode, setTemplateSvgCode] = useState("");
    let colorsCount = colorVariables.length + relativeVariables.length;

    useEffect(() => {
        computeColorSimilarity();
    }, [computeColorSimilarity, relativeFormState]);

    useEffect(() => {
        generateTemplateAndModifiedSvg();
        console.log(originSvgValid);
        console.log(colorsCount);
    }, [originSvgValid, colorsCount]) //TODO reach out to Richard, what does this warning mean.

    // eslint-disable-next-line no-extend-native
    String.prototype.isValidVar = function () {
        return (this.length === 0 || !this.trim() || this.indexOf(' ') >= 0) === false;
    };

    function generateTemplateSvgCode(swapColors) {
        const parsed = parse(originalCode);

        let nodes = jp.apply(parsed, '$..fill', swapColors);
        nodes.concat(jp.apply(parsed, '$..stroke', swapColors));
        nodes.concat(jp.apply(parsed, '$..["stop-color"]', swapColors));
        nodes.concat(jp.apply(parsed, '$..["flood-color"]', swapColors));
        nodes.concat(jp.apply(parsed, '$..["lighting-color"]', swapColors));

        const fillResult = changeValuesByPath(parsed, nodes, 'fill');
        const strokeResult = changeValuesByPath(fillResult, nodes, 'stroke');
        const stopColorResult = changeValuesByPath(strokeResult, nodes, 'stop-color');
        const floodColorResult = changeValuesByPath(stopColorResult, nodes, 'flood-color');
        const lightingColorResult = changeValuesByPath(floodColorResult, nodes, 'lighting-color');
        return hastUtilToHtml(lightingColorResult);
    }

    function generateTemplateAndModifiedSvg() {
        if (originSvgValid === true) {

            const swapModifiedColorsFunc = function swapColors(value) {
                const colorVar = _.find(colorVariables, (c) => c.mimicked === value);
                const relVar = _.find(relativeVariables, (c) => c.mimicked === value);
                if (colorVar) {
                    return colorVar.value;
                } else if (relVar) {
                    return relVar.value;
                } else {
                    return value;
                }
            }

            props.onModifiedSvgCode(generateTemplateSvgCode(swapModifiedColorsFunc));

            const swapTemplatedColorsFunc = function swapColors(value) {
                const colorVar = _.find(colorVariables, (c) => c.mimicked === value);
                const relVar = _.find(relativeVariables, (c) => c.mimicked === value);
                if (colorVar) {
                    return "{{" + colorVar.name + "}}";
                } else if (relVar) {
                    return "{{" + relVar.name + "}}";
                } else {
                    return value;
                }
            }
            const templateSvgCode = generateTemplateSvgCode(swapTemplatedColorsFunc);
            setTemplateSvgCode(templateSvgCode);
            props.onTemplatedSvgCode(templateSvgCode);
        } else {
            // clear modified ?
        }
    }

    function changeValueByPath(object, path, value) {
        if (Array.isArray(path) && path[0] === '$') {
            const pathWithoutFirstElement = path.slice(1);
            _.set(object, pathWithoutFirstElement, value);
        }
    }

    function changeValuesByPath(object, nodes, lastPropertyName) {
        nodes.forEach((node) => {
            changeValueByPath(object, node.path.concat(lastPropertyName), node.value);
        })

        return object;
    }


    function onAddColorClicked(e) {
        setAnchorElement(e.target);
    }

    const onGenerateAndCopyJsonClicked = () => {
        /**
         *    name - random string
         *    absolute - List
         *      - name, default
         *    relative - List
         *      - name, base, intensity
         *    svgCode
         */
        const generated = {};
        generated.name = Math.random().toString(36).substring(7);
        generated.abs = _.map(colorVariables, (c) => {
            return {
                "name": c.name,
                "default": c.value
            }
        })
        generated.rel = _.map(relativeVariables, (c) => {
            return {
                "name": c.name,
                "base": c.base,
                "intensity": c.intensity
            }
        })
        generated.code = templateSvgCode;
        copyToClipboard(JSON.stringify(generated));
        showToast("svg template copied");
    }

    function onColorMenuItemClicked(element, type) {
        setAnchorElement(null);

        if (type === "absolute") {
            setOpenAbsoluteColorForm(true);
        } else if (type === "relative") {
            // display list of absolute colors in a dropdown - field one
            // % increase or decrease. [intensify by]
            setOpenRelativeColorForm(true)
        }
    }

    function onOriginalSvgTextChanged(text) {

        setOriginalCode(text);
        if (!text) {
            setOriginSvgValid(undefined);
            props.onOriginSvg(undefined);
            return;
        }

        try {
            const parsed = parse(text);
            setOriginSvgValid(true)
            props.onOriginSvg(text);

            const jpColors = jp.query(parsed, '$..fill')
            jpColors.push(...jp.query(parsed, '$..["stop-color"]'));
            jpColors.push(...jp.query(parsed, '$..stroke'));
            jpColors.push(...jp.query(parsed, '$..["flood-color"]'));
            jpColors.push(...jp.query(parsed, '$..["lighting-color"]'));
            console.log("jpColors");
            console.log(jpColors);
            const extractedColors = _.uniq(jpColors).filter(color => validateColor(color));
            console.log(extractedColors);
            const extractedColorsAsObjects = extractedColors.map((e) => {
                    return {
                        "hsl": (new Color(e)).hsl().string(),
                        "actual": e
                    };
                }
            )
            setSuggestedColors(extractedColorsAsObjects);
        } catch (e) {
            props.onOriginSvg(undefined);
            setOriginSvgValid(false)
            setSuggestedColors([]);
            console.log("svg parse error");
        }
    }

    // should specify the type {@param Color}
    function flattenToHex(color) {
        const clr = color.rgb();
        const clrRgb = {red: clr.color[0], green: clr.color[1], blue: clr.color[2], alpha: clr.valpha};
        return new Color(blendAlpha(clrRgb), "rgb").hex();
    }

    function copyToClipboard(message) {
        const el = document.createElement('textarea');
        el.value = message;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    function onSuggestedColorClicked(e, color) {
        copyToClipboard(flattenToHex(new Color(color)));
        showToast(color + " copied");
    }

    function showToast(message) {
        setToast({show: true, message: message});
    }

    function closeToast(e) {
        setToast({show: false, message: ""});
    }

    function onAbsoluteColorFormFieldChanged(element, field, value) {
        if (field === 'name') {
            setAbsoluteColorName(element.target.value);
        } else if (field === 'color') {
            setAbsoluteHexColorValue(element.target.value);
        } else if (field === 'absMimicColor') {
            setAbsoluteMimicColor(value);
        }
    }

    function arrayToLab(arr) {
        return new lab(arr[0], arr[1], arr[2]);
    }

    function computeColorSimilarity() {
        if (relativeMimicColor && relativeBaseColor) {
            const mimicColorAsLab = new Color(flattenToHex(new Color(relativeMimicColor))).lab().array();

            const similarityMap = [];
            for (let i = -100; i <= 100; i++) {
                const baseColorHex = new Color(colorVariables.find(e => e.name === relativeBaseColor).mimicked).hex();
                const relativeColorLab = new Color(enhanceHexBy(baseColorHex, i)).lab().array();
                const mLab = arrayToLab(mimicColorAsLab);
                const rLab = arrayToLab(relativeColorLab)
                const diff = DeltaE.getDeltaE00(mLab, rLab);
                similarityMap.push({intensity: i, diff: diff});
            }
            setSuggestedIntensity(similarityMap.sort((a, b) => a.diff - b.diff)[0].intensity);
        }
    }

    function onRelativeFormValueChanged(e, which, value) {
        // console.log("relativeFormChanged(" + which + ", " + value + ")");
        if (which === 'intensity') {
            setRelativeIntensity(value);
        } else if (which === 'name') {
            setRelativeColorName(e.target.value);
        } else if (which === 'baseColor') {
            setRelativeBaseColor(value)
        } else if (which === "mimicColor") {
            setRelativeMimicColor(value);
        }

        setRelativeFormState(!relativeFormState);
    }

    function isRelativeFormValid() {
        const error = {};

        if (!relativeColorName.isValidVar()) {
            error.nameError = true;
        }

        if (relativeBaseColor.length === 0) {
            error.colorError = true;
        }

        if (relativeMimicColor.length === 0) {
            error.mimicError = true;
        }

        const intensityAsNumber = parseInt(relativeIntensity, 10);
        if (isNaN(intensityAsNumber) || intensityAsNumber < -100 || intensityAsNumber > 100) {
            error.intensityError = true;
        }

        // console.log(error);
        return error;
    }

    function onRelativeDialogButtonClicked(e, field) {
        if (field === 'enter') {

            let error = isRelativeFormValid();
            console.log(error);
            if (Object.keys(error).length !== 0) {
                setRelativeFormError(error);
            } else {
                error = null;
                setRelativeFormError(null);
                const baseColorHex = colorVariables.find(e => e.name === relativeBaseColor).value;
                const intensityAsNumber = parseInt(relativeIntensity, 10);
                const enhanced = new Color(enhanceHexBy(baseColorHex, intensityAsNumber)).hex();
                relativeVariables.push(new RelativeVariable(relativeColorName.trimEnd(), relativeBaseColor, intensityAsNumber, enhanced, relativeMimicColor));
                setRelativeVariables(relativeVariables);
                clearRelativeFormError();
            }

        } else if (field === 'cancel') {
            clearRelativeFormError();
        }
    }

    function clearRelativeFormError() {
        setOpenRelativeColorForm(false);
        setRelativeBaseColor("");
        setRelativeColorName("");
        setRelativeIntensity(null);
        setSuggestedIntensity(null);
        setRelativeMimicColor("");
    }

    function onAbsoluteColorDialogButtonClicked(e, name) {
        if (name === 'enter') {
            let isColorValid = /^#[0-9A-F]{6}$/i.test(absoluteHexColorValue);
            let isColorNameValid = absoluteColorName.isValidVar()

            console.log(isColorValid + " " + isColorNameValid);
            let hasError = false;
            let error = {};

            if (!isColorValid) {
                hasError = true;
                error.valueError = true;
            }

            // TODO check if the color name already exists
            if (!isColorNameValid) {
                hasError = true;
                error.nameError = true;
            }

            if (!absoluteMimicColor) {
                hasError = true;
                error.mimicError = true;
            }

            if (!hasError) {
                colorVariables.push(new ColorVariable(absoluteColorName.trimEnd(), absoluteHexColorValue, absoluteMimicColor));
                setColorVariables(colorVariables);
                clearAbsoluteForm()
            }
            setAbsoluteFormError(error)

        } else if (name === 'cancel') {
            clearAbsoluteForm()
        }
    }

    function clearAbsoluteForm() {
        setOpenAbsoluteColorForm(false);
        setAbsoluteColorName("");
        setAbsoluteHexColorValue("");
        setAbsoluteFormError(null);
        setAbsoluteMimicColor("");
    }

    function onDeleteRelativeVarClicked(e, name) {
        let newVars = relativeVariables.filter(function (item) {
            return item.name !== name
        })
        setRelativeVariables(newVars);
    }

    function onDeleteAbsoluteVarClicked(e, name) {
        let newVars = colorVariables.filter(function (item) {
            return item.name !== name
        })
        let relVars = relativeVariables.filter(function (item) {
            return item.base !== name
        })
        setRelativeVariables(relVars);
        setColorVariables(newVars);
    }

    function empty() {
    }

    return (
        <div>
            <Typography hidden={colorVariables.length === 0} style={{"marginTop": "10px"}}>Absolute colors</Typography>
            <ColorVariableList variables={colorVariables}
                               onDeleteItemClicked={onDeleteAbsoluteVarClicked}
            />
            <Divider hidden={relativeVariables.length === 0}/>
            <Typography hidden={relativeVariables.length === 0} style={{"marginTop": "10px"}}>Relative
                colors</Typography>
            <RelativeColorVariableList relativeVariables={relativeVariables}
                                       baseColors={colorVariables}
                                       onDeleteItemClicked={onDeleteRelativeVarClicked}
            />
            <Button variant="contained"
                    color="primary"
                    onClick={onAddColorClicked}
                    style={{"margin-bottom": "20px", "margin-right": "10px", "textTransform": "none"}}
            >
                add color
            </Button>

            <Button variant="contained"
                    color="primary"
                    onClick={onGenerateAndCopyJsonClicked}
                    style={{"margin-bottom": "20px", "margin-right": "10px", "textTransform": "none"}}
            >
                generate and copy json
            </Button>

            <Menu
                id="simple-menu"
                anchorEl={anchorElement}
                keepMounted
                open={Boolean(anchorElement)}
                onClose={empty}
                onMouseDown={e => {
                    setAnchorElement(null)
                }}
            >
                <MenuItem onClick={(e) => onColorMenuItemClicked(e, 'absolute')}>Absolute</MenuItem>
                <MenuItem onClick={(e) => onColorMenuItemClicked(e, 'relative')}>Relative</MenuItem>
            </Menu>

            <Divider style={{"margin-bottom": "20px"}}/>
            Detected colors
            <DetectedColorList colors={suggestedColors}
                               onCopyClicked={onSuggestedColorClicked}
            />
            <Divider style={{"margin-bottom": "20px"}}/>
            <CodeSnippet style={{"margin-bottom": "20px"}}
                         valid={originSvgValid}
                         code={originalCode}
                         enabled={true}
                         onSvgTextChanged={onOriginalSvgTextChanged}/>

            {/* not part of the main ui e.g dialogs and toasts */}
            <Snackbar
                open={toast.show}
                onClose={closeToast}
                message={toast.message}
                autoHideDuration={900}
            />
            <AbsoluteColorForm openForm={openAbsoluteColorForm}
                               formError={absoluteFormError}
                               colorName={absoluteColorName}
                               colorValue={absoluteHexColorValue}
                               colorsToMimic={suggestedColors}
                               selectedMimicColor={absoluteMimicColor}
                               onFormValueChanged={onAbsoluteColorFormFieldChanged}
                               onDialogButtonClicked={onAbsoluteColorDialogButtonClicked}
            />
            <RelativeColorForm openForm={openRelativeColorForm}
                               formError={relativeFormError}
                               baseColor={relativeBaseColor}
                               colorVariables={colorVariables}
                               colorsToMimic={suggestedColors}
                               colorName={relativeColorName}
                               intensity={relativeIntensity}
                               suggestedIntensity={suggestedIntensity}
                               selectedMimicColor={relativeMimicColor}
                               onDialogButtonClicked={onRelativeDialogButtonClicked}
                               onFormValueChanged={onRelativeFormValueChanged}
            />
        </div>
    )
}