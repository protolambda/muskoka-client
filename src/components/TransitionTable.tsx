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
    ArrowLeft,
    ArrowRight,
    CubeOutline,
    FileDocumentBox,
    FileSettingsVariantOutline,
    Git,
    Magnify,
    Tag
} from "mdi-material-ui";
import Moment from 'react-moment';
import {
    clientNames,
    ListingResult,
    listingSearchParamsToState,
    ListingSearchState,
    queryListing,
    TaskData
} from "../api";
import {Skeleton} from "@material-ui/lab";
import ResultSummary from "./ResultSummary";
import {Link, withRouter} from "react-router-dom";
import {RouteComponentProps} from "react-router";
import KeyDisplay from "./KeyDisplay";

type TransitionTableState = {
    dirty: boolean,
    // task key
    taskKey: string,
    searchState: ListingSearchState,
    // if undefined, the data needs to be loaded.
    listing: undefined | ListingResult,
    // true when data is loading.
    loading: boolean,
    // when there is an error, undefined when no error.
    err: undefined | Error
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const ClientMenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const styles = (theme: Theme) => {
    return createStyles({
        tableFilters: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            borderTopLeftRadius: theme.spacing(1),
            borderTopRightRadius: theme.spacing(1),
        },
        clientNamesSelect: {
            minWidth: '10em',
        },
        versionInput: {
            minWidth: '7em',
            maxWidth: '10em'
        },
        configInput: {
            minWidth: '9em',
            maxWidth: '12em'
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
        paginationText: {
            color: "#fff",
        },
        resultsInfoPaper: {
            backgroundColor: theme.palette.secondary.main,
            color: "#fff",
            width: "100%",
            minHeight: "10rem",
            padding: theme.spacing(2),
            textAlign: "center"
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
            backgroundColor: theme.palette.primary.main,
            width: "100%",
            height: theme.spacing(1),
            borderBottomLeftRadius: theme.spacing(1),
            borderBottomRightRadius: theme.spacing(1),
        },
        navFab: {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText
        }
    });
};

// Router params, aka 'this.props.match.params.*'
type TransitionTableParams = {
    before?: string,
    after?: string,
}

type TransitionTableProps = WithStyles<typeof styles> & RouteComponentProps<TransitionTableParams> & {}

interface Column {
    id: 'index' | 'key' | 'time' | 'spec-version' | 'spec-config' | 'blocks' | 'clients';
    label: any;
    minWidth?: number;
    format: (value: TaskData) => any;
    cellPlaceholder: () => any;
}

const columns: Column[] = [
    {
        id: 'index',
        label: '#',
        minWidth: 30,
        format: (value: TaskData) => (<Link to={'/task/' + value.key} style={{
            textDecoration: 'none',
            color: 'inherit'
        }}>{value.index}</Link>),
        cellPlaceholder: () => (<Skeleton height={6} width="80%"/>)
    },
    {
        id: 'key',
        label: 'Key',
        minWidth: 200,
        format: (value: TaskData) => (<Link to={'/task/' + value.key} style={{
            textDecoration: 'none',
            color: 'inherit'
        }}><KeyDisplay>{value.key}</KeyDisplay></Link>),
        cellPlaceholder: () => (<Skeleton height={6} width="80%"/>)
    },
    {
        id: 'spec-version',
        label: 'Spec Version',
        minWidth: 60,
        format: (value: TaskData) => value.specVersion,
        cellPlaceholder: () => (<Skeleton height={6} width="50%"/>)
    },
    {
        id: 'spec-config',
        label: 'Spec Config',
        minWidth: 80,
        format: (value: TaskData) => value.specConfig,
        cellPlaceholder: () => (<Skeleton height={6} width="50%"/>)
    },
    {
        id: 'blocks',
        label: <CubeOutline style={{position: 'relative', top: '0.15em'}}/>,
        minWidth: 30,
        format: (value: TaskData) => value.blocks,
        cellPlaceholder: () => (<Skeleton height={6} width="30%"/>)
    },
    {
        id: 'time', label: 'Time ago',
        minWidth: 50,
        format: (value: TaskData) => <Moment fromNow>{value.created}</Moment>,
        cellPlaceholder: () => (<Skeleton height={6} width="60%"/>)
    },
    {
        id: 'clients',
        label: 'Results',
        minWidth: 400,
        format: (value: TaskData) => (<ResultSummary results={value.results}/>),
        cellPlaceholder: () => (<Skeleton height={6} width="80%"/>)
    },
];

class TransitionTable extends Component<TransitionTableProps, TransitionTableState> {

    state: Readonly<TransitionTableState> = {
        dirty: false,
        taskKey: "",
        listing: undefined,
        searchState: {specVersion: undefined, specConfig: undefined, clients: {}, hasFail: false, after: undefined, before: undefined},
        loading: true,
        err: undefined
    };

    componentDidMount(): void {
        this.setState({searchState: listingSearchParamsToState(this.props.location.search)}, () => {
            this.loadData();
        });
    }

    loadData = () => {
        this.setState({err: undefined, loading: true}, () => {
            queryListing(this.state.searchState).then(resp => {
                this.props.history.push({
                    pathname: '/',
                    search: "?" + resp.params.toString()
                });
                this.setState({listing: resp.listing, loading: false});
            }).catch(err => {
                console.log(err);
                this.setState({err: err, loading: false})
            })
        });
    };

    handleChangeTaskKey = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({taskKey: event.target.value as string});
    };

    handleChangeSpecVersion = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState(prev => ({
            searchState: {...prev.searchState, specVersion: event.target.value as string},
            dirty: true
        }));
    };

    handleChangeSpecConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState(prev => ({
            searchState: {...prev.searchState, specConfig: event.target.value as string},
            dirty: true
        }));
    };

    handleChangeClientVersion = (clientName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as string;
        this.setState(prev => ({
            searchState: {...prev.searchState, clients: {...prev.searchState.clients, [clientName]: value}}, dirty: true
        }));
    };

    handleChangeClientNames = (event: React.ChangeEvent<{ value: unknown }>) => {
        this.setState(prev => {
            const clients = event.target.value as string[];
            const clientsMap: Record<string, string> = {};
            clients.forEach(c => {
                clientsMap[c] = prev.searchState.clients[c] || 'all'
            });
            return ({searchState: {...prev.searchState, clients: clientsMap}, dirty: true});
        });
    };

    handleChangeHasFail = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState(prev => ({searchState: {...prev.searchState, hasFail: event.target.checked}, dirty: true}));
    };

    render() {
        const {classes} = this.props;
        return (
            <>
                <div className={classes.tableFilters}>
                    <Grid container spacing={4} alignItems="flex-end">
                        <Grid item>
                            <Grid container spacing={1} alignItems="flex-end">
                                <Grid item>
                                    <FileDocumentBox/>
                                </Grid>
                                <Grid item>
                                    <TextField id="input-with-icon-grid" label="Find transition by key"
                                               onChange={this.handleChangeTaskKey}/>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="secondary" disabled={this.state.taskKey === ""}
                                    href={"/task/" + encodeURIComponent(this.state.taskKey)}>
                                Lookup
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container spacing={4} alignItems="flex-end">
                        <Grid item>
                            <Grid container spacing={1} alignItems="flex-end">
                                <Grid item>
                                    <Tag/>
                                </Grid>
                                <Grid item>
                                    <TextField label="spec version"
                                               onChange={this.handleChangeSpecVersion}
                                               className={classes.versionInput}/>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Grid container spacing={1} alignItems="flex-end">
                                <Grid item>
                                    <FileSettingsVariantOutline/>
                                </Grid>
                                <Grid item>
                                    <TextField label="spec config"
                                               onChange={this.handleChangeSpecConfig} className={classes.configInput}/>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <FormControlLabel
                                control={
                                    <Switch checked={this.state.searchState.hasFail} color="primary"
                                            onChange={this.handleChangeHasFail} value="hasFail"/>
                                }
                                label="With crashes only"
                            />
                        </Grid>
                        <Grid item>
                            <FormControl>
                                <InputLabel htmlFor="select-multiple-checkbox">Clients</InputLabel>
                                <Select
                                    multiple
                                    className={classes.clientNamesSelect}
                                    value={Object.keys(this.state.searchState.clients)}
                                    onChange={this.handleChangeClientNames}
                                    input={<Input id="select-multiple-checkbox"/>}
                                    renderValue={selected => (selected as string[]).join(', ')}
                                    MenuProps={ClientMenuProps}
                                >
                                    {clientNames.map(name => (
                                        <MenuItem key={name} value={name}>
                                            <Checkbox checked={this.state.searchState.clients.hasOwnProperty(name)}/>
                                            <ListItemText primary={name}/>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {Object.entries(this.state.searchState.clients).map(([name, version]) => (
                            <Grid item key={"client-version-" + name}>
                                <Grid container spacing={1} alignItems="flex-end">
                                    <Grid item>
                                        <Git/>
                                    </Grid>
                                    <Grid item>
                                        <TextField label={name + " version"}
                                                   value={version || ""}
                                                   onChange={this.handleChangeClientVersion(name)}
                                                   className={classes.versionInput}/>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}
                        <Grid item>
                            <Button variant="contained" color="secondary" disabled={!this.state.dirty}
                                    onClick={this.loadData}>
                                <Magnify/>
                                Search
                            </Button>
                        </Grid>
                    </Grid>
                </div>
                {this.state.loading && (
                    <LinearProgress color="primary"/>
                )}
                {!!this.state.err
                    ? (
                        <div className={classes.loadingErrPaper}>
                            <Typography variant="subtitle1">{this.state.err.toString().replace('TypeError: ', '')}</Typography>
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
                                            [...Array(20)].map((_, i) => (
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
                                        : (
                                            this.state.listing && this.state.listing.tasks.map(task => (
                                                <TableRow hover tabIndex={-1} key={task.key}>
                                                    {columns.map(column => (
                                                        <TableCell key={column.id} className={classes.tableCell}
                                                                   align="left">
                                                            {column.format(task)}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                        )
                                    }
                                </TableBody>
                            </Table>

                            {this.state.listing && this.state.listing.tasks.length == 0 &&
                            <div className={classes.resultsInfoPaper}>
                                <Typography variant="subtitle1">No results found.</Typography>
                            </div>}
                        </div>
                    )
                }
                <div className={classes.tableEnd}/>
                {this.state.listing &&
                    <div className={classes.tableNav}>
                        { (this.state.listing && this.state.listing.tasks.length > 0 && this.state.listing.tasks[0].index + 1 < this.state.listing.totalTaskCount) ?
                        <Fab className={classes.navFab} aria-label="prev-page"
                             href={'?after=' + this.state.listing.tasks[0].index.toString()}>
                            <ArrowLeft/>
                        </Fab>
                            : <div/>
                        }
                        { (this.state.listing && this.state.listing.tasks.length > 1) &&
                        <Typography variant="subtitle1" className={classes.paginationText}>
                            <strong>{this.state.listing.tasks[this.state.listing.tasks.length - 1].index}</strong> - <strong>
                            {this.state.listing.tasks[0].index}</strong></Typography>
                        }
                        { (this.state.listing && this.state.listing.tasks.length > 0 && this.state.listing.tasks[this.state.listing.tasks.length - 1].index > 0) ?
                        <Fab className={classes.navFab} aria-label="next-page"
                             href={'?before=' + this.state.listing.tasks[this.state.listing.tasks.length - 1].index.toString()}>
                            <ArrowRight/>
                        </Fab> : <div/>
                        }
                    </div>
                }
            </>
        )
    }
}

const StyledTransitionTable = withStyles(styles)(TransitionTable);
export default withRouter(StyledTransitionTable);
