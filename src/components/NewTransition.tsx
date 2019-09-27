import React, {Component} from 'react';
import {
    createStyles,
    Theme,
    withStyles,
    WithStyles
} from "@material-ui/core";

type State = {}

const styles = (theme: Theme) => {
    const light = theme.palette.type === 'light';
    return createStyles({
        root: {
        },
    });
};

interface Props extends WithStyles<typeof styles> {
}

class NewTransition extends Component<Props, State> {

    state: Readonly<State> = {};

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>

            </div>
        )
    }
}

export default withStyles(styles)(NewTransition);
