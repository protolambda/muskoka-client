import React from 'react';
import {Container, createStyles, Theme, Typography, WithStyles, withStyles} from "@material-ui/core";

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
    });
};

interface Props extends WithStyles<typeof styles> {
}

const LandingHeader: React.FC<Props> = ({classes}) => (
    <div className={classes.root}>
        <Container maxWidth="md">
            <Typography component="h1" variant="h1"
                        className={classes.headerTitle + " header-title"}>Muskoka 🛶</Typography>
        </Container>
    </div>
);

export default withStyles(styles)(LandingHeader);

