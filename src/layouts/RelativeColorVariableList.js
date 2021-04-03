import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText, MenuItem,
    Typography
} from "@material-ui/core";
import ColorPreviewCircle from "./ColorPreviewCircle";
import {enhanceHexBy} from "../Utils";
import React from "react";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteOutlineSharpIcon from '@material-ui/icons/DeleteOutlineSharp';

export default function RelativeColorVariableList(props) {
    return (
        <List component="nav" aria-label="relative variables">
            {props.relativeVariables.map((variable) =>
                <ListItem button>
                    <ListItemIcon>
                        {/*{console.log()}*/}
                        <ColorPreviewCircle
                            color={enhanceHexBy(getBaseColor(props.baseColors, variable.base)?.value, variable.intensity)}/>
                    </ListItemIcon>
                    <ListItemText
                        primary={variable.name}
                        secondary={
                            <Box display="flex" flexDirection="row">
                                <Typography style={{"fontStyle": "italic"}}>
                                    {getBaseColor(props.baseColors, variable.base).name}
                                </Typography>
                                &nbsp;
                                {intensityIcon(variable.intensity)}
                                <Typography>
                                    &nbsp;{variable.intensity}%
                                </Typography>
                            </Box>
                        }
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