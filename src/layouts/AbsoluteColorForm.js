import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {Button, TextField} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import React from "react";

export default function AbsoluteColorForm(props) {
    return (<Dialog
        open={props.openForm} onClose={{}} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">add absolute color</DialogTitle>
        <DialogContent>
            {/*<DialogContentText>*/}
            {/*    set color hex and variable name*/}
            {/*</DialogContentText>*/}
            <TextField
                error={props.colorError?.nameError === true}
                autoFocus
                margin="dense"
                id="name"
                label="name"
                value={props.colorName}
                fullWidth
                onChange={(e) => props.onFormValueChanged(e, 'name')}
            />
            <TextField
                error={props.colorError?.valueError === true}
                margin="dense"
                id="name"
                value={props.colorValue}
                label="hex color"
                onChange={(e) => props.onFormValueChanged(e, 'color')}
                fullWidth
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