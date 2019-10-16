import {createMuiTheme} from '@material-ui/core/styles';

const light = true;

export const theme = createMuiTheme({
    palette: {
        type: light ? 'light' : 'dark', // TODO add switch in UI to change to 'dark'
        common: {
            black: '#000',
            white: '#fff'
        },
        primary: {
            light: light ? '#eeeeee' : '#333333',
            main: light ? '#dddddd' : '#1d1d1d',
            dark: light ? '#bbbbbb' : '#0b0b0b',
            contrastText: light ? '#333333' : '#cccccc',
        },
        secondary: {
            light: '#7fc4f6',
            main: '#54aeef',
            dark: '#3a7aa8',
            contrastText: light ? '#000' : '#fff'
        },
        error: {
            light: '#ff6666',
            main: '#ff0000',
            dark: '#d32f2f',
            contrastText: '#fff'
        },
    }
});
