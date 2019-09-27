import React from "react";
import {createStyles, Theme, withStyles, WithStyles} from "@material-ui/core";

const styles = (theme: Theme) => {
    const light = theme.palette.type === 'light';
    return createStyles({
        root: {
            height: '1em',
        },
        water: {
            fill: light ? '#55ACEE' : '#000',
        },
        canoe: {
            fill: light ? '#DD2E44' : '#751923',
        },
        paddle: {
            fill: light ? '#FFAC33' : '#FFAC33',
        },
        paddleEnd: {
            fill: light ? '#FFCC4D' : '#FFCC4D',
        },
    });
};

interface Props extends WithStyles<typeof styles> {
}

// This is a TSX version of the original Twitter emoji Canoe emoji (U+1F6F6).
// Original is licensed under CC-BY 4.0, by Twitter, Inc and its contributors. See https://github.com/twitter/twemoji
const Canoe: React.FC<Props> = ({classes}) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 30" className={classes.root}>
    <path className={classes.canoe}
          d="M33.793 17S32.476 20 18 20C3.523 20 1.973 17 1.973 17S-1 22.117 4.802 25c4.238 2.105 10.916-.131 12.723-.814 1.991.683 9.274 2.824 13.557.814 5.862-2.751 2.711-8 2.711-8z"/>
    <path className={classes.water} d="M0 24h36v12H0z"/>
    <path className={classes.paddle}
          d="M27.005 25.389c.206 0 .412-.079.569-.236.315-.315.315-.824 0-1.139l-8.861-8.86c-.315-.315-.824-.315-1.139 0-.315.315-.315.824 0 1.139l8.861 8.86c.158.157.364.236.57.236z"/>
    <path className={classes.paddleEnd}
          d="M29.316 28.505c.412 0 .825-.157 1.139-.472.629-.629.629-1.649 0-2.278l-2.416-2.416c-.629-.629-1.65-.629-2.278 0-.629.629-.629 1.649 0 2.278l2.416 2.416c.314.315.727.472 1.139.472z"/>
</svg>);

export default withStyles(styles)(Canoe);
