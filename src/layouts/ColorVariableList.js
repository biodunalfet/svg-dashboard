import {IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import ColorPreviewCircle from "./ColorPreviewCircle";
import React from "react";
import DeleteOutlineSharpIcon from '@material-ui/icons/DeleteOutlineSharp';

export default function ColorVariableList(props) {

    return (
        <List component="nav" aria-label="color variables">
            {props.variables.map((variable) =>
                <ListItem button>
                    <ListItemIcon>
                        <ColorPreviewCircle color={variable.value}/>
                    </ListItemIcon>
                    <ListItemText
                        primary={variable.name}
                        secondary={variable.value}
                    />
                    <ListItemSecondaryAction onClick={(e) => props.onDeleteItemClicked(e, variable.name)}>
                        <IconButton edge="end" aria-label="delete">
                            <DeleteOutlineSharpIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            )}
        </List>
    )
}