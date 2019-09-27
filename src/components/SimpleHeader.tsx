import React from 'react';
import {createStyles, Theme, Typography, WithStyles, withStyles} from "@material-ui/core";
import Canoe from "./Canoe";

const styles = (theme: Theme) => {
    const light = theme.palette.type === 'light';
    return createStyles({
        headerTitle: {
            color: light ? '#000' : '#fff',
            textAlign: "center",
        },
        root: {
            padding: theme.spacing(1),
        },
    });
};

interface Props extends WithStyles<typeof styles> {
}

const SimpleHeader: React.FC<Props> = ({classes}) => (
    <div className={classes.root}>
        <Typography component="h1" variant="h3"
                    className={classes.headerTitle + " header-title"}>Muskoka <Canoe/></Typography>
    </div>
);

export default withStyles(styles)(SimpleHeader);

