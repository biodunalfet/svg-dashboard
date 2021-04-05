import {
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Tooltip
} from "@material-ui/core";
import ColorPreviewCircle from "./ColorPreviewCircle";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import React from "react";

export default function DetectedColorList(props) {
    return (<List component="nav" aria-label="suggested colors">
        {props.colors.map((color) =>
            <ListItem button>
                <ListItemIcon>
                    <ColorPreviewCircle color={color.actual}/>
                </ListItemIcon>
                <ListItemText primary={color.actual} secondary={color.hsl}/>
                <ListItemSecondaryAction>
                    <Tooltip title="Copy as Hex" aria-label="copy-hex">
                        <IconButton edge="end" aria-label="copy-hex-button"
                                    onClick={(e) => props.onCopyClicked(e, color.actual)}>
                            <FileCopyOutlinedIcon/>
                        </IconButton>
                    </Tooltip>
                </ListItemSecondaryAction>
            </ListItem>
        )}
    </List>);

}