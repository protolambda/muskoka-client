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
    InputLabel,
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
    Theme,
    withStyles,
    WithStyles
} from "@material-ui/core";
import {ArrowLeft, ArrowRight, CubeOutline, Git, Magnify, Tag} from "mdi-material-ui";
import Moment from 'react-moment';
import {ClientIcon} from "./ClientComponents";
import {queryListing, TaskData} from "../api";

type TransitionState = {
    dirty: boolean,
    crashesOnly: boolean,
    // if undefined, all spec versions are listed
    specVersion: undefined | string,
    // if empty, all clients are listed
    clientNames: Array<string>,
    // <clientName> --> <clientVersion>
    clientVersions: Record<string, string>,
    // if undefined, the data needs to be loaded.
    data: undefined | Array<TaskData>,
    // for pagination (without numbering, based on relative order). Undefined = no specific start
    startAfter: undefined | string,
    // for pagination (without numbering, based on relative order). Undefined = no specific end
    endBefore: undefined | string,
    // true when data is loading.
    loading: boolean,
    // when there is an error, undefined when no error.
    err: undefined | Error
}

const clientNames = [
    'artemis', 'harmony', 'lighthouse', 'lodestar', 'nimbus', 'prysm', 'pyspec', 'shasper', 'trinity', 'yeeth', 'zrnt'
];

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
    const light = theme.palette.type === 'light';
    return createStyles({
        tableFilters: {
            backgroundColor: light ? '#ffcd4c' : '#403a29',
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
        tableHead: {
            backgroundColor: light ? '#ffcd4c' : '#403a29',
        },
        tableHeadCell: {
            backgroundColor: light ? '#ffcd4c' : '#403a29',
        },
        tableBody: {
            backgroundColor: light ? '#feffd9' : '#1e1913',
        },
        tableCell: {
            borderBottomColor: light ? '#ffcd4c' : '#403a29',
            color: light ? '#333333' : '#cccccc',
        },
        tableNav: {
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8
        }
    });
};

interface TransitionProps extends WithStyles<typeof styles> {
}

interface Column {
    id: 'key' | 'time' | 'spec-version' | 'blocks' | 'clients';
    label: any;
    minWidth?: number;
    format: (value: TaskData) => any;
}

const columns: Column[] = [
    {id: 'key', label: 'Key', format: (value: TaskData) => value.key},
    {id: 'spec-version', label: 'Spec Version', format: (value: TaskData) => value.specVersion},
    {
        id: 'blocks',
        label: <CubeOutline style={{position: 'relative', top: '0.15em'}}/>,
        format: (value: TaskData) => value.blocks
    },
    {id: 'time', label: 'Time ago', format: (value: TaskData) => <Moment fromNow>{value.created}</Moment>},
    {
        id: 'clients',
        label: 'Results',
        format: (value: TaskData) => <div>{Object.entries(value.result).map(([k, v]) => <ClientIcon key={k}
                                                                                                    clientVendor={v.clientVendor}/>)}</div>
    },
];

class TransitionTable extends Component<TransitionProps, TransitionState> {

    state: Readonly<TransitionState> = {
        dirty: false,
        crashesOnly: false,
        specVersion: undefined,
        clientNames: [],
        clientVersions: {},
        data: undefined,
        startAfter: undefined,
        endBefore: undefined,
        loading: true,
        err: undefined
    };

    loadData = () => {
        this.setState({err: undefined, loading: true}, () => {
            queryListing({
                clients: this.state.clientNames.map(name => ({name: name, version: this.state.clientVersions[name]})),
                specVersion: this.state.specVersion,
                crashesOnly: this.state.crashesOnly,
                startAfter: this.state.startAfter,
                endBefore: this.state.endBefore,
            }).then(listing => {
                this.setState({data: listing, loading: false})
            }).catch(err => {
                console.log(err);
                this.setState({err: err, loading: false})
            })
        });
    };

    handleChangeClientNames = (event: React.ChangeEvent<{ value: unknown }>) => {
        this.setState({clientNames: event.target.value as string[], dirty: true});
    };

    handleChangeCrashesOnly = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({crashesOnly: event.target.checked, dirty: true});
    };

    render() {
        const {classes} = this.props;
        // @ts-ignore
        return (
            <>
                <div className={classes.tableFilters}>
                    {this.state.err && (
                        <div>
                            {/*TODO style error */}
                            Error! {this.state.err.toString()}
                        </div>
                    )}
                    <Grid container spacing={4} alignItems="flex-end">
                        <Grid item>
                            <Grid container spacing={1} alignItems="flex-end">
                                <Grid item>
                                    <Magnify />
                                </Grid>
                                <Grid item>
                                    <TextField id="input-with-icon-grid" label="Find transition by key" />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Grid container spacing={1} alignItems="flex-end">
                                <Grid item>
                                    <Tag />
                                </Grid>
                                <Grid item>
                                    <TextField id="input-with-icon-grid" label="spec version" className={classes.versionInput} />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <FormControlLabel
                                control={
                                    <Switch checked={this.state.crashesOnly} color="primary" onChange={this.handleChangeCrashesOnly} value="crashesOnly" />
                                }
                                label="With crashes only"
                            />
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" disabled={!this.state.dirty}>
                                Search
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container spacing={4} alignItems="flex-end">
                        <Grid item>
                            <FormControl>
                                <InputLabel htmlFor="select-multiple-checkbox">Clients</InputLabel>
                                <Select
                                    multiple
                                    className={classes.clientNamesSelect}
                                    value={this.state.clientNames}
                                    onChange={this.handleChangeClientNames}
                                    input={<Input id="select-multiple-checkbox" />}
                                    renderValue={selected => (selected as string[]).join(', ')}
                                    MenuProps={ClientMenuProps}
                                >
                                    {clientNames.map(name => (
                                        <MenuItem key={name} value={name}>
                                            <Checkbox checked={this.state.clientNames.indexOf(name) > -1} />
                                            <ListItemText primary={name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {this.state.clientNames.map(name => (
                            <Grid item key={"client-version-"+name}>
                                <Grid container spacing={1} alignItems="flex-end">
                                    <Grid item>
                                        <Git />
                                    </Grid>
                                    <Grid item>
                                        <TextField id="input-with-icon-grid" label={name+" version"} className={classes.versionInput}/>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </div>
                {this.state.loading && (
                    <div>
                        {/*TODO style loading indicator */}
                        Loading...
                    </div>
                )}
                <Table stickyHeader>
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
                        {this.state.data && this.state.data.map(task => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={task.key}>
                                    {columns.map(column => (
                                        <TableCell key={column.id} className={classes.tableCell} align="left">
                                            {column.format(task)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                <div className={classes.tableNav}>
                    <Fab color="secondary" aria-label="edit">
                        <ArrowLeft/>
                    </Fab>
                    <Fab color="secondary" aria-label="edit">
                        <ArrowRight/>
                    </Fab>
                </div>
            </>
        )
    }
}

export default withStyles(styles)(TransitionTable);
