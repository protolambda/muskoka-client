import {createMuiTheme} from '@material-ui/core/styles';

const light = false;

export const theme = createMuiTheme({
    palette: {
        type: light ? 'light' : 'dark', // TODO add switch in UI to change to 'dark'
        common: {
            black: '#000',
            white: '#fff'
        },
        primary: {
            light: light ? '#ffffff' : '#eeeeee',
            main: light ? '#dddddd' : '#202020',
            dark: light ? '#8e8e8e' : '#121212',
            contrastText: light ? '#333333' : '#cccccc',
        },
        secondary: {
            light: light ? '#ffffff' : '#eeeeee',
            main: light ? '#d2d2d2' : '#383838',
            dark: light ? '#929292' : '#303030',
            contrastText: light ? '#1e1e1e' : '#fff'
        },
        error: {
            light: '#ff6666',
            main: '#ff0000',
            dark: '#611919',
            contrastText: '#fff'
        },
    }
});
