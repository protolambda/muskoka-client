import React, {Component} from 'react';
import {
    Container,
    createStyles,
    Theme,
    Typography,
    withStyles,
    WithStyles
} from "@material-ui/core";
import "./Main.css";
import TransitionTable from "./TransitionTable";
import {ClientChip} from "./ClientComponents";

type MainState = {}

const styles = (theme: Theme) => {
    const light = theme.palette.type === 'light';
    return createStyles({
        headerTitle: {
            color: light ? '#000' : '#fff'
        },
        headerContents: {
            // backgroundColor: light ? '#ffffff' : '#090d14',
        },
        root: {
        },
        clientsOverview: {
            backgroundColor: light ? '#de2a42' : '#751923',
        },
    });
};

interface MainProps extends WithStyles<typeof styles> {
}

class TransitionDetail extends Component<MainProps, MainState> {

    state: Readonly<MainState> = {};

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <div>
                    <Container maxWidth="lg">
                        <div>
                            <Typography component="h3" variant="h3" className={classes.headerTitle}>v0.8.3 🛶</Typography>
                            <ClientChip clientVendor="pyspec" clientVersion="v0.1.2"/>
                            <ClientChip clientVendor="artemis" clientVersion="v0.3.4"/>
                            <ClientChip clientVendor="lighthouse" clientVersion="v0.5.2"/>
                        </div>
                        <div>
                            <Typography component="h3" variant="h3" className={classes.headerTitle}>v0.8.2 🛶</Typography>
                            <ClientChip clientVendor="harmony" clientVersion="v0.1.4"/>
                            <ClientChip clientVendor="lodestar" clientVersion="v0.6.5"/>
                            <ClientChip clientVendor="nimbus" clientVersion="v0.7.8"/>
                        </div>
                        <div>
                            <Typography component="h3" variant="h3" className={classes.headerTitle}>v0.8.1 🛶</Typography>
                            <ClientChip clientVendor="prysm" clientVersion="v0.4.6"/>
                            <ClientChip clientVendor="shasper" clientVersion="v0.7.3"/>
                            <ClientChip clientVendor="trinity" clientVersion="v0.2.5"/>
                        </div>
                    </Container>
                    <Container maxWidth="lg">
                        <TransitionTable/>
                    </Container>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(TransitionDetail);
