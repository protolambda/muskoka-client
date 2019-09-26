import React, {Component} from 'react';
import {
    createStyles, Fab,
    Table, TableBody, TableCell, TableHead, TableRow,
    Theme,
    withStyles,
    WithStyles
} from "@material-ui/core";
import {ArrowLeft, ArrowRight, CubeOutline} from "mdi-material-ui";
import Moment from 'react-moment';
import {ClientIcon} from "./ClientComponents";

type MainState = {}

const styles = (theme: Theme) => {
    const light = theme.palette.type === 'light';
    return createStyles({
        tableCell: {
            borderBottomColor: light ? '#ffcd4c' : '#403a29',
            color: light ? '#333333' : '#cccccc',
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
        tableNav: {
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8
        }
    });
};

interface MainProps extends WithStyles<typeof styles> {
}

type ResultData = {
    success: boolean,
    created: Date,
    clientVendor: string,
    clientVersion: string,
    postHash: string
}

type TaskData = {
    blocks: number,
    specVersion: string,
    created: string,
    key: string, // to retrieve storage data with
    result: Record<string, ResultData>,
};

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

const rows: Array<TaskData> = [
    {
        blocks: 5,
        specVersion: 'v0.8.3',
        created: new Date().toISOString(),
        key: 'asdfbdfbgfddsffdsaasddsangnfb',
        result: {
            'asvfnbvmvhgfzgngsfn': {
                success: true,
                created: new Date(),
                clientVendor: 'pyspec',
                clientVersion: 'v0.1.2',
                postHash: '0x12a634b12c34479712a634b12c34479712a634b12c34479712a634b12c344797',
            }
        }
    },
    {
        blocks: 5,
        specVersion: 'v0.8.3',
        created: new Date().toISOString(),
        key: 'asfsdgdfhfgfghfgh',
        result: {
            'asvfnbvmvhgfzgngsfn': {
                success: true,
                created: new Date(),
                clientVendor: 'pyspec',
                clientVersion: 'v0.1.2',
                postHash: '0x12a634b12c34479712a634b12c34479712a634b12c34479712a634b12c344797',
            }
        }
    },
    {
        blocks: 5,
        specVersion: 'v0.8.3',
        created: new Date().toISOString(),
        key: 'afdsgfdhfgdjfgjtyjtuk',
        result: {
            'asvfnbvmvhgfzgngsfn': {
                success: true,
                created: new Date(),
                clientVendor: 'pyspec',
                clientVersion: 'v0.1.2',
                postHash: '0x12a634b12c34479712a634b12c34479712a634b12c34479712a634b12c344797',
            }
        }
    },
    {
        blocks: 5,
        specVersion: 'v0.8.3',
        created: new Date().toISOString(),
        key: 'sgfhjhmdhghgehyjhh',
        result: {
            'asvfnbvmvhgfzgngsfn': {
                success: true,
                created: new Date(),
                clientVendor: 'pyspec',
                clientVersion: 'v0.1.2',
                postHash: '0x12a634b12c34479712a634b12c34479712a634b12c34479712a634b12c344797',
            }
        }
    },
    {
        blocks: 5,
        specVersion: 'v0.8.3',
        created: new Date().toISOString(),
        key: 'asdfbdfbgfddsffdsaasddsangnfb',
        result: {
            'asvfnbvmvhgfzgngsfn': {
                success: true,
                created: new Date(),
                clientVendor: 'pyspec',
                clientVersion: 'v0.1.2',
                postHash: '0x12a634b12c34479712a634b12c34479712a634b12c34479712a634b12c344797',
            }
        }
    },
    {
        blocks: 5,
        specVersion: 'v0.8.3',
        created: new Date().toISOString(),
        key: 'asdfbdfbgfddsffdsaasddsangnfb',
        result: {
            'asvfnbvmvhgfzgngsfn': {
                success: true,
                created: new Date(),
                clientVendor: 'pyspec',
                clientVersion: 'v0.1.2',
                postHash: '0x12a634b12c34479712a634b12c34479712a634b12c34479712a634b12c344797',
            }
        }
    },
];

class TransitionTable extends Component<MainProps, MainState> {

    state: Readonly<MainState> = {};

    render() {
        const {classes} = this.props;
        return (
            <>
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
                        {rows.map(row => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.key}>
                                    {columns.map(column => (
                                        <TableCell key={column.id} className={classes.tableCell} align="left">
                                            {column.format(row)}
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
