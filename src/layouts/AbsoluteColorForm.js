import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {Button, InputAdornment, MenuItem, TextField} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import React from "react";
import ColorPreviewCircle from "./ColorPreviewCircle";
import {isColorValid} from "../Utils";

export default function AbsoluteColorForm(props) {
    return (<Dialog
        open={props.openForm} onClose={{}} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">add absolute color</DialogTitle>
        <DialogContent>
            <TextField
                error={props.formError?.nameError === true}
                autoFocus
                margin="dense"
                id="name"
                label="name"
                value={props.colorName}
                fullWidth
                onChange={(e) => props.onFormValueChanged(e, 'name')}
            />
            <TextField
                error={props.formError?.mimicError === true}
                id="select-mimicked-color"
                select
                label="select mimicked color"
                fullWidth
                value={props.selectedMimicColor || ''}
                helperText="please select a color"
            >
                {props.colorsToMimic.map((variables) =>
                    <MenuItem key={variables.actual} value={variables.actual}
                              onClick={(e) => props.onFormValueChanged(e, 'absMimicColor', variables.actual)}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <ColorPreviewCircle color={variables.hsl}/>
                            <div style={{"margin-left": "16px"}}>{variables.actual}</div>
                        </div>
                    </MenuItem>
                )}
            </TextField>
            <TextField
                error={props.formError?.valueError === true}
                margin="dense"
                id="name"
                value={props.colorValue}
                label="hex color"
                onChange={(e) => props.onFormValueChanged(e, 'color')}
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            {isColorValid(props.colorValue) && <ColorPreviewCircle color={props.colorValue}/>}
                        </InputAdornment>
                    ),
                }}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={(e) => props.onDialogButtonClicked(e, 'cancel')} color="primary">
                Cancel
            </Button>
            <Button onClick={(e) => props.onDialogButtonClicked(e, 'enter')} color="primary">
                Enter
            </Button>
        </DialogActions>
    </Dialog>)
};