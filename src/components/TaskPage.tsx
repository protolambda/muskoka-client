import React, {Component} from 'react';
import {
    Button,
    Checkbox,
    createStyles,
    Fab,
    FormControl,
    FormControlLabel,
    Grid,
    Input,
    InputLabel, LinearProgress,
    ListItemText,
    MenuItem,
    Select,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Theme, Typography,
    withStyles,
    WithStyles
} from "@material-ui/core";
import {
    Alert,
    ArrowLeft,
    ArrowRight, CalendarClock, CheckOutline,
    CubeOutline,
    FileDocumentBox,
    FileSettingsVariantOutline,
    Git,
    Magnify,
    Tag
} from "mdi-material-ui";
import Moment from 'react-moment';
import {ClientIcon} from "./ClientComponents";
import {clientNames, queryListing, queryTask, ResultData, TaskData} from "../api";
import {Skeleton} from "@material-ui/lab";
import ResultSummary from "./ResultSummary";

type TaskPageState = {
    // loaded data
    task?: TaskData,
    // true when data is loading.
    loading: boolean,
    // when there is an error, undefined when no error.
    err: undefined | Error
}

const styles = (theme: Theme) => {
    const light = theme.palette.type === 'light';
    return createStyles({
        taskGeneralContainer: {
            backgroundColor: light ? '#ffcd4c' : '#1d1d1d',
            color: light ? '#333333' : '#cccccc',
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            borderTopLeftRadius: theme.spacing(1),
            borderTopRightRadius: theme.spacing(1),
        },
        tableContainer: {
            maxWidth: '100%',
            overflowX: 'scroll',
        },
        tableHead: {
            backgroundColor: light ? '#ffcd4c' : '#1d1d1d',
        },
        tableHeadCell: {
            backgroundColor: light ? '#ffcd4c' : '#1d1d1d',
            color: light ? '#333333' : '#cccccc',
        },
        tableBody: {
            backgroundColor: light ? '#feffe9' : '#191919',
        },
        tableCell: {
            borderBottomColor: light ? '#ffcd4c' : '#191919',
            color: light ? '#333333' : '#cccccc',
        },
        tableNav: {
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8
        },
        loadingErrPaper: {
            backgroundColor: theme.palette.error[theme.palette.type],
            color: "#fff",
            width: "100%",
            minHeight: "10rem",
            padding: theme.spacing(2),
            textAlign: "center"
        },
        tableEnd: {
            backgroundColor: light ? '#ffcd4c' : '#1d1d1d',
            width: "100%",
            height: theme.spacing(1),
            borderBottomLeftRadius: theme.spacing(1),
            borderBottomRightRadius: theme.spacing(1),
        },
        navFab: {
            backgroundColor: light ? '#ffcd4c' : '#1d1d1d',
            color: light ? "#fff" : "#999"
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
    id: 'key' | 'client-name' | 'client-version' | 'time' | 'success' | 'post-hash';
    label: any;
    minWidth?: number;
    format: (value: ResultEntry) => any;
    cellPlaceholder: () => any;
}

const columns: Column[] = [
    {
        id: 'key',
        label: 'Key',
        format: (value: ResultEntry) => value.key,
        cellPlaceholder: () => (<Skeleton height={6} width="80%"/>)
    },
    {
        id: 'client-name',
        label: 'Client',
        format: (value: ResultEntry) => value.data.clientName,
        cellPlaceholder: () => (<Skeleton height={6} width="80%"/>)
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
        format: (value: ResultEntry) => <Moment fromNow>{value.data.created}</Moment>,
        cellPlaceholder: () => (<Skeleton height={6} width="60%"/>)
    },
    {
        id: 'success',
        label: <CubeOutline style={{position: 'relative', top: '0.15em'}}/>,
        format: (value: ResultEntry) => value.data.success ? <CheckOutline/> : <Alert/>,
        cellPlaceholder: () => (<Skeleton height={6} width="30%"/>)
    },
    {
        id: 'post-hash',
        label: 'Post-hash',
        minWidth: 400,
        format: (value: ResultEntry) => (<code>{value.data.postHash}</code>),
        cellPlaceholder: () => (<Skeleton height={6} width="80%"/>)
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
        return (
            <>
                <div className={classes.taskGeneralContainer}>
                    <Grid container spacing={4} alignItems="flex-end">
                        <Grid item>
                            <Grid container spacing={1} alignItems="flex-end">
                                <Grid item>
                                    <FileDocumentBox/>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2">Task key:</Typography>
                                    <Typography variant="body2">{this.props.taskKey}</Typography>}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Grid container spacing={1} alignItems="flex-end">
                                <Grid item>
                                    <FileSettingsVariantOutline/>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2">Spec config:</Typography>
                                    {this.state.task ? <Typography variant="body2">{this.state.task.specConfig}</Typography> : <Skeleton height={6} width={40}/>}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Grid container spacing={1} alignItems="flex-end">
                                <Grid item>
                                    <Tag/>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2">Spec version:</Typography>
                                    {this.state.task ? <Typography variant="body2">{this.state.task.specVersion}</Typography> : <Skeleton height={6} width={20}/>}
                                </Grid>
                            </Grid>
                        </Grid>


                        <Grid item>
                            <Grid container spacing={1} alignItems="flex-end">
                                <Grid item>
                                    <CubeOutline/>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2">Blocks:</Typography>
                                    {this.state.task ? <Typography variant="body2">{this.state.task.blocks}</Typography> : <Skeleton height={6} width={10}/>}
                                </Grid>
                            </Grid>
                        </Grid>


                        <Grid item>
                            <Grid container spacing={1} alignItems="flex-end">
                                <Grid item>
                                    <CalendarClock/>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2">Time ago:</Typography>
                                    {this.state.task ? <Typography variant="body2"><Moment fromNow>{this.state.task.created}</Moment></Typography> : <Skeleton height={6} width={30}/>}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
                {this.state.loading && (
                    <LinearProgress color="primary" />
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
                                                        <TableCell key={column.id} className={classes.tableCell} align="left">
                                                            {column.cellPlaceholder()}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                        )
                                        : (
                                            this.state.task && this.state.task.results && Object.entries(this.state.task.results).map(([key, data]) => (
                                                <TableRow hover tabIndex={-1} key={key}>
                                                    {columns.map(column => (
                                                        <TableCell key={column.id} className={classes.tableCell} align="left">
                                                            {column.format({
                                                                key: key,
                                                                data: data,
                                                            })}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                                ))
                                        )
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
