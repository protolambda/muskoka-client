import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import About from "./components/About";
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core/styles';
import {Container} from "@material-ui/core";
import LandingHeader from "./components/LandingHeader";
import SimpleHeader from "./components/SimpleHeader";
import TransitionTable from "./components/TransitionTable";

const styles = (theme: Theme) => createStyles({
    root: {
        backgroundColor: (theme.palette.type === 'light') ? '#54aeef' : '#122634',
        height: "100%",
        width: "100%"
    }
});

interface Props extends WithStyles<typeof styles> {}

const Pages: React.FC<Props> = ({classes}) => {
    return (
        <div className={classes.root}>
            <Router>
                <Switch>
                    <Route exact path='/' component={LandingHeader}/>
                    <Route path='*' component={SimpleHeader}/>
                </Switch>
                <Container maxWidth="lg">
                    <Switch>
                        <Route exact path='/' component={TransitionTable}/>
                        <Route exact strict={false} path='/about' component={About}/>
                    </Switch>
                </Container>
            </Router>
        </div>
    );
};

export default withStyles(styles)(Pages);
