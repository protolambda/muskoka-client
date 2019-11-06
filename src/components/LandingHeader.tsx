import React from 'react';
import {Container, createStyles, Fab, Grid, Theme, Typography, WithStyles, withStyles} from "@material-ui/core";
import {Upload} from "mdi-material-ui";
import Canoe from "./Canoe";

const styles = (theme: Theme) => {
    const light = theme.palette.type === 'light';
    return createStyles({
        headerTitle: {
            color: light ? '#000' : '#fff',
            textAlign: "center",
        },
        root: {
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(5),
        },
        fab: {
            margin: theme.spacing(1),
        },
        extendedIcon: {
            marginRight: theme.spacing(1),
        },
    });
};

interface Props extends WithStyles<typeof styles> {
}

const LandingHeader: React.FC<Props> = ({classes}) => (
    <div className={classes.root}>
        <Container maxWidth="md">
            <Grid container spacing={4} alignItems="flex-end">
                <Grid item>
                    <Fab variant="extended" aria-label="delete" className={classes.fab} href="/new">
                        <Upload className={classes.extendedIcon} />
                        Upload new transition
                    </Fab>
                </Grid>
                <Grid item>
            <Typography component="h1" variant="h1"
                        className={classes.headerTitle + " header-title"}>Muskoka <Canoe/></Typography>
                </Grid>
            </Grid>
        </Container>
    </div>
);

export default withStyles(styles)(LandingHeader);

