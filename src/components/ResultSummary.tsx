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
import {ResultData} from "../api";
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
            position: "relative"
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
    const byPostHash: Record<string, Array<ResultData>> = {};
    mainLoop: for (const r of Object.values(results)) {
        if (!byPostHash.hasOwnProperty(r.postHash)) {
            byPostHash[r.postHash] = [];
        }
        const arr = byPostHash[r.postHash];
        // some tasks may run more than once because of pubsub delivery acknowledgement delays. Spot them (if they have the same data), and ignore the duplicates
        for (const other of arr) {
            if (other.success === r.success && other.clientName === r.clientName && other.clientVersion === r.clientVersion) {
                continue mainLoop;
            }
        }
        arr.push(r);
    }
    const orderedPostHashes = Object.keys(byPostHash).sort((ka, kb) => {
        const a = byPostHash[ka];
        const b = byPostHash[kb];
        for (const v of a) {
            // canonical spec to the left
            if (v.clientName == "pyspec") {
                return -1;
            }
            // failures to the right
            if (!v.success) {
                return 1;
            }
        }
        for (const v of b) {
            // canonical spec to the left
            if (v.clientName == "pyspec") {
                return 1;
            }
            // failures to the right
            if (!v.success) {
                return -1;
            }
        }
        return ka.localeCompare(kb);
    });
    return (
        <div className={classes.root} style={{borderWidth: "2px", borderColor: postHashCountColors[Math.min(Object.keys(byPostHash).length, postHashCountColors.length - 1)]}}>
            {orderedPostHashes.map(k => {
                const v = byPostHash[k];
                return (
                    <div key={k} className={classes.resultGroup}>
                        {v.map((v) => (
                            <Tooltip title={
                                <List className={classes.root}>
                                    <ListItem>
                                        <ListItemAvatar className={classes.clientTooltipAvatar}>
                                            <ClientIcon clientName={v.clientName}/>
                                        </ListItemAvatar>
                                        <ListItemText primary={<strong>{v.clientName}</strong>} secondary={
                                            <div className={classes.clientTooltipData}>
                                                <strong>{v.clientVersion}</strong><br/>
                                                <Moment fromNow>{v.created}</Moment>
                                            </div>} />
                                    </ListItem>
                                </List>}>
                                <div className={classes.result}>
                                    <div className={classes.resultIconWrap}>
                                        <ClientIcon clientName={v.clientName}/>
                                    </div>
                                    <div className={classes.resultOverlay + (v.success ? "" : " " + classes.failResult)}/>
                                </div>
                            </Tooltip>
                        ))}
                    </div>
                )
            })}
        </div>
    );
};

export default withStyles(styles)(ResultSummary);

