import {createMuiTheme} from '@material-ui/core/styles';

export const theme = createMuiTheme({
    palette: {
        type: 'light', // TODO add switch in UI to change to 'dark'
        common: {
            black: '#000',
            white: '#fff'
        },
        primary: {
            light: '#7fc4f6',
            main: '#54aeef',
            dark: '#3a7aa8',
            contrastText: '#fff'
        },
        secondary: {
            light: '#ffcd4c',
            main: '#ffcd4c',
            dark: '#ffae2f',
            contrastText: '#fff'
        },
        error: {
            light: '#ff6666',
            main: '#ff0000',
            dark: '#d32f2f',
            contrastText: '#fff'
        },
    }
});
