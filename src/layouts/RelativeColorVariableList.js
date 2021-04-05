import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Typography
} from "@material-ui/core";
import ColorPreviewCircle from "./ColorPreviewCircle";
import React from "react";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteOutlineSharpIcon from '@material-ui/icons/DeleteOutlineSharp';

export default function RelativeColorVariableList(props) {
    return (
        <List component="nav" aria-label="relative variables">
            {props.relativeVariables.map((variable) =>
                <ListItem>
                    <ListItemIcon>
                        <ColorPreviewCircle
                            color={variable.value}/>
                    </ListItemIcon>
                    <ListItemText
                        primary={variable.name}
                        secondary={
                            <Box>
                                <Typography>
                                    <span style={{"fontStyle": "italic"}}>
                                        {getBaseColor(props.baseColors, variable.base).name}
                                    </span>
                                    {intensityIcon(variable.intensity)} {variable.intensity}% ➡️ [{variable.value}]
                                </Typography>
                            </Box>
                        }
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
};

function intensityIcon(i) {
    if (i > 0) {
        return <ExpandLessIcon fontSize="small"/>
    } else {
        return <ExpandMoreIcon fontSize="small"/>
    }
}

function getBaseColor(baseList, base)
{
    return baseList.find(e => e.name === base);
}