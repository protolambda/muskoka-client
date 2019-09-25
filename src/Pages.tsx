import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Main} from "./components/Main";
import About from "./components/About";
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
    root: {
        backgroundColor: theme.palette.background.default,
        height: '100%'
    }
});

interface Props extends WithStyles<typeof styles> {}

const Pages: React.FC<Props> = ({classes}) => {
    return (
        <div className={classes.root}>
            <Router>
                <Switch>
                    <Route exact path='/' component={Main}/>
                    <Route exact strict={false} path='/about' component={About}/>
                </Switch>
            </Router>
        </div>
    );
};

export default withStyles(styles)(Pages);
