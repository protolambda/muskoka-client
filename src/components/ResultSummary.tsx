import React from 'react';
import {
    createStyles,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Theme,
    Tooltip,
    WithStyles,
    withStyles
} from "@material-ui/core";
import {orderedResults, ResultData} from "../api";
import Moment from "react-moment";
import {ClientIcon} from "./ClientComponents";

const styles = (theme: Theme) => {
    const light = theme.palette.type === 'light';
    return createStyles({
        root: {
            padding: 2,
            borderRadius: theme.spacing(1),
        },
        result: {
            width: "3rem",
            height: "3rem",
            position: "relative",
            backgroundColor: light ? "#999" : "#444",
            borderRadius: "0.5rem",
        },
        resultIconWrap: {
            padding: theme.spacing(1),
            height: "100%",
            display: "flex",
            alignItems: "center"
        },
        resultOverlay: {
            position: "absolute",
            borderRadius: "0.5rem",
            zIndex: 100,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
        },
        failResult: {
            backgroundColor: "rgba(255,0,0,0.2)"
        },
        resultGroup: {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            paddingTop: 2,
            paddingBottom: 2,
            borderColor: "rgba(0,0,0,0.1)",
            borderStyle: "solid",
            borderWidth: 2,
            borderRadius: theme.spacing(1),
            width: "max-content",
        },
        clientTooltipData: {
            color: "#fff"
        },
        clientTooltipAvatar: {
            padding: theme.spacing(1),
            width: "4rem",
            height: "4rem",
        }
    });
};

interface Props extends WithStyles<typeof styles> {
    results: Record<string, ResultData>
}

// the more different post-hashes, the more red the results are colored.
const postHashCountColors = [
    "rgba(0,0,0,0)", // no post hashes yet
    "rgba(0,255,0,0.2)", // all the same
    "rgba(255,0,0,0.2)", // 2 different hashes
    "rgba(255,0,0,0.3)",
    "rgba(255,0,0,0.5)",
    "rgba(255,0,0,0.7)"
];

const ResultSummary: React.FC<Props> = ({classes, results}) => {
    const ordered = orderedResults(results);
    return (
        <div className={classes.root} style={{borderWidth: "2px", borderColor: postHashCountColors[Math.min(Object.keys(ordered).length, postHashCountColors.length - 1)]}}>
            {ordered.map(g => {
                return (
                    <div key={g.postHash} className={classes.resultGroup}>
                        {g.results.map((v) => (
                            <div key={v.key}>
                                <Tooltip title={
                                    <List className={classes.root}>
                                        <ListItem>
                                            <ListItemAvatar className={classes.clientTooltipAvatar}>
                                                <ClientIcon clientName={v.data.clientName}/>
                                            </ListItemAvatar>
                                            <ListItemText primary={<strong>{v.data.clientName}</strong>} secondary={
                                                <div className={classes.clientTooltipData}>
                                                    <strong>{v.data.clientVersion}</strong><br/>
                                                    <Moment fromNow>{v.data.created}</Moment>
                                                </div>} />
                                        </ListItem>
                                    </List>}>
                                    <div className={classes.result}>
                                        <div className={classes.resultIconWrap}>
                                            <ClientIcon clientName={v.data.clientName}/>
                                        </div>
                                        <div className={classes.resultOverlay + (v.data.success ? "" : " " + classes.failResult)}/>
                                    </div>
                                </Tooltip>
                            </div>
                        ))}
                    </div>
                )
            })}
        </div>
    );
};

export default withStyles(styles)(ResultSummary);

