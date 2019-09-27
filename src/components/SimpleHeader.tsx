import React from 'react';
import {createStyles, Theme, Typography, WithStyles, withStyles} from "@material-ui/core";
import Canoe from "./Canoe";
import {Link} from "react-router-dom";

const styles = (theme: Theme) => {
    const light = theme.palette.type === 'light';
    return createStyles({
        headerTitle: {
            color: light ? '#000' : '#fff',
            textAlign: "center",
        },
        link: {
            textDecoration: "none"
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
        <Link to="/" className={classes.link}>
            <Typography component="h1" variant="h3"
                        className={classes.headerTitle + " header-title"}>Muskoka <Canoe/></Typography>
        </Link>
    </div>
);

export default withStyles(styles)(SimpleHeader);

