import React, {Component} from 'react';
import {
    Grid,
    Button,
    IconButton,
    LinearProgress,
    List, ListItem, ListItemIcon, ListItemText,
    Table, TableBody, TableCell, TableHead, TableRow,
    Theme, Typography,
    createStyles,
    withStyles,
    WithStyles
} from "@material-ui/core";
import {
    Alert,
    CalendarClock, CheckBold, CloudDownload,
    CubeOutline, Download,
    FileDocumentBox,
    FileSettingsVariantOutline, FlagOutline, PoundBoxOutline,
    Tag
} from "mdi-material-ui";
import Moment from 'react-moment';
import {ClientIcon} from "./ClientComponents";
import {
    getBlocksInputURL,
    getPreStateInputURL, orderedResults,
    queryTask,
    ResultData,
    TaskData
} from "../api";
import {Skeleton} from "@material-ui/lab";
import KeyDisplay from "./KeyDisplay";
import TransitionDetail from "./TransitionDetail";
import {Link} from "react-router-dom";

type TaskPageState = {
    // loaded data
    task?: TaskData,
    // true when data is loading.
    loading: boolean,
    // when there is an error, undefined when no error.
    err: undefined | Error
}

const styles = (theme: Theme) => {
    return createStyles({
        taskGeneralContainer: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            borderTopLeftRadius: theme.spacing(1),
            borderTopRightRadius: theme.spacing(1),
        },
        transitionDetail: {
            width: '100%',
        },
        downloadBtn: {
            margin: theme.spacing(1),
        },
        blocksDownloadLink: {
            textDecoration: 'none',
            color: 'inherit',
        },
        tableContainer: {
            maxWidth: '100%',
            overflowX: 'scroll',
        },
        tableHead: {
            backgroundColor: theme.palette.primary.main,
        },
        tableHeadCell: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
        tableBody: {
            backgroundColor: theme.palette.secondary.main,
        },
        tableCell: {
            borderBottomColor: theme.palette.secondary.main,
            color: theme.palette.primary.contrastText,
        },
        tableNav: {
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8
        },
        loadingErrPaper: {
            backgroundColor: theme.palette.error[theme.palette.type],
            color: theme.palette.error.contrastText,
            width: "100%",
            minHeight: "10rem",
            padding: theme.spacing(2),
            textAlign: "center"
        },
        tableEnd: {
            backgroundColor: theme.palette.primary.main,
            width: "100%",
            height: theme.spacing(1),
            borderBottomLeftRadius: theme.spacing(1),
            borderBottomRightRadius: theme.spacing(1),
        },
        navFab: {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
        }
    });
};

interface TaskPageProps extends WithStyles<typeof styles> {
    taskKey: string,
}

type ResultEntry = {
    key: string,
    data: ResultData,
}

interface Column {
    id: 'key' | 'client-name' | 'client-version' | 'time' | 'success' | 'post-hash' | 'post-download' | 'out-view' | 'err-view';
    label: any;
    minWidth?: number;
    format: (value: ResultEntry) => any;
    cellPlaceholder: () => any;
}

const columns: Column[] = [
    {
        id: 'key',
        label: 'Key',
        format: (value: ResultEntry) => <KeyDisplay>{value.key}</KeyDisplay>,
        cellPlaceholder: () => (<Skeleton height={6} width="80%"/>)
    },
    {
        id: 'client-name',
        label: 'Client',
        minWidth: 200,
        format: (value: ResultEntry) =>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <div style={{width: '2rem'}}>
                        <ClientIcon clientName={value.data.clientName}/>
                    </div>
                </Grid>
                <Grid item>
                    {value.data.clientName}
                </Grid>
            </Grid>,
        cellPlaceholder: () => (<span><Skeleton height={10} width={10}/> <Skeleton height={6} width="80%"/></span>)
    },
    {
        id: 'client-version',
        label: 'Client version',
        format: (value: ResultEntry) => value.data.clientVersion,
        cellPlaceholder: () => (<Skeleton height={6} width="60%"/>)
    },
    {
        id: 'time',
        label: 'Time ago',
        minWidth: 110,
        format: (value: ResultEntry) => <Moment fromNow>{value.data.created}</Moment>,
        cellPlaceholder: () => (<Skeleton height={6} width="60%"/>)
    },
    {
        id: 'success',
        label: <FlagOutline style={{position: 'relative', top: '0.15em'}}/>,
        minWidth: 40,
        format: (value: ResultEntry) => value.data.success ? <CheckBold/> : <Alert/>,
        cellPlaceholder: () => (<Skeleton height={6} width="30%"/>)
    },
    {
        id: 'post-hash',
        label: 'Post-hash',
        format: (value: ResultEntry) => (<KeyDisplay>{value.data.postHash}</KeyDisplay>),
        cellPlaceholder: () => (<Skeleton height={6} width="80%"/>)
    },
    {
        id: 'post-download',
        label: 'Post state',
        format: (value: ResultEntry) => (
            <IconButton aria-label="download-post" href={value.data.files.postStateURL}>
                <Download/>
            </IconButton>
        ),
        cellPlaceholder: () => (<Skeleton height={6} width={6}/>)
    },
    {
        id: 'out-view',
        label: 'Log',
        format: (value: ResultEntry) => (
            <IconButton aria-label="out-view"  href={value.data.files.outLogURL}>
                <Download/>
            </IconButton>
        ),
        cellPlaceholder: () => (<Skeleton height={6} width={6}/>)
    },
    {
        id: 'err-view',
        label: 'Error Log',
        format: (value: ResultEntry) => (
            <IconButton aria-label="err-view"  href={value.data.files.errLogURL}>
                <Download/>
            </IconButton>
        ),
        cellPlaceholder: () => (<Skeleton height={6} width={6}/>)
    },

];


class TaskPage extends Component<TaskPageProps, TaskPageState> {

    state: Readonly<TaskPageState> = {
        task: undefined,
        loading: true,
        err: undefined
    };

    componentDidMount(): void {
        this.loadData();
    }

    loadData = () => {
        this.setState({err: undefined, loading: true}, () => {
            queryTask(this.props.taskKey).then(task => {
                this.setState({task: task, loading: false})
            }).catch(err => {
                console.log(err);
                this.setState({err: err, loading: false})
            })
        });
    };

    render() {
        const {classes} = this.props;
        const ordered = this.state.task && this.state.task.results ? orderedResults(this.state.task.results) : null;

        return (
            <>
                <div className={classes.taskGeneralContainer}>
                    <Typography variant="h3">
                        Transition task
                    </Typography>
                    <br/>
                    <Grid container spacing={4} alignItems="flex-start" justify="space-between">
                        <Grid item>
                            <TransitionDetail icon={<PoundBoxOutline/>} label="Index"
                                              value={<KeyDisplay>{this.state.task && this.state.task.index}</KeyDisplay>} skeletonWidth={30}/>
                            <TransitionDetail icon={<FileDocumentBox/>} label="Task key"
                                              value={<KeyDisplay>{this.props.taskKey}</KeyDisplay>} skeletonWidth={0}/>
                            <TransitionDetail icon={<FileSettingsVariantOutline/>} label="Spec config"
                                              value={this.state.task && this.state.task.specConfig} skeletonWidth={40}/>
                            <TransitionDetail icon={<Tag/>} label="Spec version"
                                              value={this.state.task && this.state.task.specVersion}
                                              skeletonWidth={40}/>
                            <TransitionDetail icon={<CubeOutline/>} label="Blocks"
                                              value={this.state.task && this.state.task.blocks} skeletonWidth={20}/>
                            <TransitionDetail icon={<CalendarClock/>} label="Time ago" value={this.state.task &&
                            <Moment fromNow>{this.state.task.created}</Moment>} skeletonWidth={50}/>
                            <TransitionDetail icon={<FileSettingsVariantOutline/>} label="Spec config"
                                              value={this.state.task && this.state.task.specConfig} skeletonWidth={40}/>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">
                                Pre-state
                            </Typography>
                            <Button
                                variant="outlined"
                                color="default"
                                className={classes.downloadBtn}
                                startIcon={<CloudDownload/>}
                                href={this.state.task ? getPreStateInputURL(this.props.taskKey, this.state.task.specVersion, this.state.task.specConfig) : "/"}
                                disabled={!this.state.task}>
                                Download
                            </Button>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">
                                Blocks
                            </Typography>
                            {this.state.task &&
                            <List dense={true}>
                                {([...(new Array(this.state.task.blocks))]).map((_, i) =>
                                    <a
                                        // @ts-ignore
                                        href={getBlocksInputURL(i)(this.props.taskKey, this.state.task.specVersion, this.state.task.specConfig)}
                                        className={classes.blocksDownloadLink}>
                                        <ListItem key={"block-download-" + i}>
                                            <ListItemIcon>
                                                <CloudDownload/>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={"Download Block #" + i}
                                            />
                                        </ListItem>
                                    </a>,
                                )}
                            </List>
                            }
                        </Grid>
                    </Grid>
                    <br/>
                    <Typography variant="h3">
                        Results
                    </Typography>
                </div>
                {this.state.loading && (
                    <LinearProgress color="primary"/>
                )}
                {!!this.state.err
                    ? (
                        <div className={classes.loadingErrPaper}>
                            <Typography variant="subtitle1">{this.state.err.toString()}</Typography>
                        </div>
                    )
                    : (
                        <div className={classes.tableContainer}>
                            <Table>
                                <TableHead className={classes.tableHead}>
                                    <TableRow>
                                        {columns.map(column => (
                                            <TableCell
                                                key={column.id}
                                                align="left"
                                                className={classes.tableHeadCell}
                                                style={{minWidth: column.minWidth}}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody className={classes.tableBody}>
                                    {this.state.loading
                                        ? (
                                            [...Array(8)].map((_, i) => (
                                                <TableRow hover tabIndex={-1} key={'el' + i}>
                                                    {columns.map(column => (
                                                        <TableCell key={column.id} className={classes.tableCell}
                                                                   align="left">
                                                            {column.cellPlaceholder()}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                        )
                                        : (ordered && ordered.flatMap(entry => (entry.results.map((r, i) => (
                                            // Group results with the same post-hash.
                                            <TableRow hover tabIndex={-1} key={r.key}
                                                      style={i == entry.results.length - 1 ? {marginBottom: '1rem'} : {}}>
                                                {columns.map(column => (
                                                    <TableCell key={column.id} className={classes.tableCell}
                                                               align="left">
                                                        {column.format(r)}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        )))))
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    )
                }
                <div className={classes.tableEnd}/>
            </>
        )
    }
}

export default withStyles(styles)(TaskPage);
