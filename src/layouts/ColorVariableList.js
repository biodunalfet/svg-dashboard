import {
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText
} from "@material-ui/core";
import ColorPreviewCircle from "./ColorPreviewCircle";
import React from "react";
import DeleteOutlineSharpIcon from '@material-ui/icons/DeleteOutlineSharp';

export default function ColorVariableList(props) {
    console.log("colorVariableList re-rendered");
    return (
        <List component="nav" aria-label="color variables">
            {props.variables.map((variable) =>
                <ListItem>
                    <ListItemIcon>
                        <ColorPreviewCircle color={variable.value}/>
                    </ListItemIcon>
                    <ListItemText
                        primary={variable.name}
                        secondary={variable.value}
                    />
                    <ListItemText
                        secondary={variable.mimicked}
                    />
                    <ListItemIcon>
                        <ColorPreviewCircle dimen="25" color={variable.mimicked}/>
                    </ListItemIcon>
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