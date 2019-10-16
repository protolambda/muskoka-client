import React, {Component} from 'react';
import {
    createStyles, Grid,
    Theme,
    withStyles,
    WithStyles
} from "@material-ui/core";
import {Skeleton} from "@material-ui/lab";

type State = {}

const styles = (theme: Theme) => {
    return createStyles({
        root: {
            width: '100%',
        },
        label: {
            minWidth: 150
        },
        icon: {
            marginTop: -2
        }
    });
};

interface Props extends WithStyles<typeof styles> {
    icon: any,
    label: any,
    value?: any,
    skeletonWidth: number
}

class TransitionDetail extends Component<Props, State> {

    state: Readonly<State> = {};

    render() {
        const {classes, icon, label, value, skeletonWidth} = this.props;
        return (
            <div className={classes.root}>
                <Grid container spacing={2}>
                    <Grid item>
                        <div className={classes.icon}>
                            {icon}
                        </div>
                    </Grid>
                    <Grid item className={classes.label}>
                        <strong>{label}</strong>
                    </Grid>
                    <Grid item>
                        {value ?
                            value :
                            <Skeleton height={6} width={skeletonWidth}/>
                        }
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(TransitionDetail);
