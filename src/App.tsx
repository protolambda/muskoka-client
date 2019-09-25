import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {MuiThemeProvider} from "@material-ui/core/styles";
import {theme} from "./theming";
import Pages from "./Pages";

const App: React.FC = () => {
    return (
        <React.Fragment>
            <CssBaseline/>
            <MuiThemeProvider theme={theme}>
                <Pages/>
            </MuiThemeProvider>
        </React.Fragment>
    );
};

export default App;
