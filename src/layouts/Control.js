import React, {useState} from "react";
import {
    Button,
    Divider, List, ListItem, ListItemIcon, ListItemText,
    Menu,
    MenuItem
} from "@material-ui/core";
import CodeSnippet from "./CodeSnippet";
import ColorVariable from "../domain/ColorVariable";
import ColorVariableList from "./ColorVariableList";
import AbsoluteColorForm from "./AbsoluteColorForm";
import RelativeColorForm from "./RelativeColorForm";
import RelativeVariable from "../domain/RelativeVariable";
import RelativeColorVariableList from "./RelativeColorVariableList";

export default function Control(props) {

    const [anchorElement, setAnchorElement] = useState(null);
    const [openAbsoluteColorForm, setOpenAbsoluteColorForm] = useState(false);
    const [openRelativeColorForm, setOpenRelativeColorForm] = useState(false);
    const [absoluteColorName, setAbsoluteColorName] = useState("");
    const [absoluteHexColorValue, setAbsoluteHexColorValue] = useState("");
    const [absoluteColorError, setAbsoluteColorError] = useState(null);
    const [colorVariables, setColorVariables] = useState([])
    const [relativeVariables, setRelativeVariables] = useState([])
    const [relativeColorName, setRelativeColorName] = useState("")
    const [relativeBaseColor, setRelativeBaseColor] = useState("")
    const [relativeIntensity, setRelativeIntensity] = useState("")
    const [relativeFormError, setRelativeFormError] = useState(null);

    /**
     *  Questions:
     *  How do you store simple data? Local storage or within the context?
     *  How do you read the content of svg? Is this necessary?
     *  How do you deploy?
     *  How do you add basic google authentication?
     *  How do you link to firestore?
     *
     */

    // eslint-disable-next-line no-extend-native
    String.prototype.isValidVar = function () {
        return (this.length === 0 || !this.trim() || this.indexOf(' ') >= 0) === false;
    };

    function onAddColorClicked(e) {
        setAnchorElement(e.target);
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

    function onAbsoluteColorFormFieldChanged(element, field) {
        if (field === 'name') {
            setAbsoluteColorName(element.target.value);
        } else if (field === 'color') {
            setAbsoluteHexColorValue(element.target.value);
        }
    }

    function onRelativeColorBaseSelected(e, which) {
        console.log(which);
        setRelativeBaseColor(which)
    }

    function onRelativeFormValueChanged(e, which) {
        if (which === 'intensity') {
            console.log(e.target.value);
            setRelativeIntensity(e.target.value);
        } else if (which === 'name') {
            setRelativeColorName(e.target.value);
        }
    }

    function onRelativeDialogButtonClicked(e, field) {
        if (field === 'enter') {
            // validate fields
            let hasError = false;
            let error = {};

            if (!relativeColorName.isValidVar()) {
                hasError = error;
                error.nameError = true;
            }

            if (relativeBaseColor.length === 0) {
                hasError = true;
                error.colorError = true;
            }

            const intensityAsNumber = parseInt(relativeIntensity, 10);
            if (isNaN(intensityAsNumber) || intensityAsNumber < -100 || intensityAsNumber > 100) {
                hasError = true;
                error.intensityError = true;
            }

            console.log(hasError);
            if (hasError) {
                setRelativeFormError(error);
            } else {
                error = null;
                setRelativeFormError(null);
                relativeVariables.push(new RelativeVariable(relativeColorName, relativeBaseColor, intensityAsNumber));
                setRelativeVariables(relativeVariables);
                setOpenRelativeColorForm(false);
                setRelativeBaseColor("");
                setRelativeIntensity("");
                setRelativeColorName("");
            }

        } else if (field === 'cancel') {
            setOpenRelativeColorForm(false);
            setRelativeBaseColor("");
            setRelativeIntensity("");
        }
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

            if (hasError) {
                console.log(error);
            } else {
                colorVariables.push(new ColorVariable(absoluteColorName, absoluteHexColorValue));
                setColorVariables(colorVariables);
                setOpenAbsoluteColorForm(false);
                error = null;
                setAbsoluteColorName("")
                setAbsoluteHexColorValue("")
            }
            setAbsoluteColorError(error)

            /**
             * TODO check if color is a valid hex color.
             * if true,
             *      add to list, ✅
             *      then close dialog, ✅
             *      then create url svg variable and run a replace operation
             *      then render templated svg
             *      then render templated code
             * else
             *      show error
             */

        } else if (name === 'cancel') {
            setOpenAbsoluteColorForm(false);
            setAbsoluteColorName("");
            setAbsoluteHexColorValue("");
        }
    }

    function onDeleteRelativeVarClicked(e, name) {
        let newVars = relativeVariables.filter(function(item) {
            return item.name !== name
        })
        setRelativeVariables(newVars);
    }

    function onDeleteAbsoluteVarClicked(e, name) {
        let newVars = colorVariables.filter(function(item) {
            return item.name !== name
        })
        let relVars = relativeVariables.filter(function(item) {
            return item.base !== name
        })
        setRelativeVariables(relVars);
        setColorVariables(newVars);
    }

    function empty() {}

    return (
        <div>
            <ColorVariableList variables={colorVariables}
                               onDeleteItemClicked={onDeleteAbsoluteVarClicked}
            />
            <Divider hidden={relativeVariables.length === 0}/>
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
            <CodeSnippet/>
            <AbsoluteColorForm openForm={openAbsoluteColorForm}
                               colorError={absoluteColorError}
                               colorName={absoluteColorName}
                               onFormValueChanged={onAbsoluteColorFormFieldChanged}
                               colorValue={absoluteHexColorValue}
                               onDialogButtonClicked={onAbsoluteColorDialogButtonClicked}
            />
            <RelativeColorForm openForm={openRelativeColorForm}
                               formError={relativeFormError}
                               baseColor={relativeBaseColor}
                               colorVariables={colorVariables}
                               colorName={relativeColorName}
                               onColorBaseSelected={onRelativeColorBaseSelected}
                               intensity={relativeIntensity}
                               onDialogButtonClicked={onRelativeDialogButtonClicked}
                               onFormValueChanged={onRelativeFormValueChanged}
                />
        </div>
    )
}