import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import About from "./components/About";
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core/styles';
import {Container} from "@material-ui/core";
import LandingHeader from "./components/LandingHeader";
import SimpleHeader from "./components/SimpleHeader";
import TransitionTable from "./components/TransitionTable";
import Page404 from "./components/404";
import NewTransition from "./components/NewTransition";
import TaskPage from "./components/TaskPage";

const styles = (theme: Theme) => createStyles({
    root: {
        backgroundColor: (theme.palette.type === 'light') ? '#54aeef' : '#000000',
        minHeight: "100%",
        paddingBottom: theme.spacing(4),
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
                        <Route exact strict={false} path='/new' component={NewTransition}/>
                        <Route exact strict={false} path='/task/:taskKey' children={({match}) => (
                            match ? <TaskPage taskKey={match.params.taskKey}/>
                                  : <Redirect to='/'/>
                        )}/>
                        <Route path='404' component={Page404}/>
                        <Route component={Page404}/>
                    </Switch>
                </Container>
            </Router>
        </div>
    );
};

export default withStyles(styles)(Pages);
