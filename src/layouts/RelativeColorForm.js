import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {Button, MenuItem, TextField} from "@material-ui/core";
import ColorPreviewCircle from "./ColorPreviewCircle";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import React from "react";

export default function RelativeColorForm(props) {
    return (<Dialog open={props.openForm}
                    onClose={{}}
                    aria-labelledby="form-dialog-title"
    >
        <DialogTitle id="form-dialog-title">add relative color</DialogTitle>
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
                error={props.formError?.colorError === true}
                id="select-relative-color"
                select
                label="Select"
                fullWidth
                value={props.baseColor || ''}
                helperText="Please select a color"
            >
                {props.colorVariables.map((variables) =>
                    <MenuItem key={variables.name} value={variables.name} onClick={(e) => props.onColorBaseSelected(e, variables.name)}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <ColorPreviewCircle color={variables.value}/>
                            <div style={{"margin-left": "16px"}}>{variables.name}</div>
                        </div>
                    </MenuItem>
                )}
            </TextField>
            <TextField
                error={props.formError?.intensityError === true}
                autoFocus
                margin="dense"
                id="name"
                label="enhance by"
                type="number"
                value={props.intensity}
                onChange={(e) => props.onFormValueChanged(e, 'intensity')}
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