import React, {Component} from 'react';
import {
    Avatar,
    Chip,
    Container,
    createStyles, Fab,
    Paper,
    Theme,
    Typography,
    withStyles,
    WithStyles
} from "@material-ui/core";
import "./Main.css";
import {ArrowLeft, ArrowRight} from "mdi-material-ui";
import Moment from 'react-moment';

type MainState = {}

const styles = (theme: Theme) => {
    const light = theme.palette.type === 'light';
    return createStyles({
        headerTitle: {
            color: light ? '#000' : '#fff'
        },
        headerContents: {
            backgroundColor: light ? '#ffffff' : '#090d14',
        },
        root: {
            backgroundColor: light ? '#54aeef' : '#122634',
        },
        mainContents: {
        },
        tableHead: {
            backgroundColor: light ? '#ffcd4c' : '#403a29',
        }
    });
};

interface MainProps extends WithStyles<typeof styles> {
}

interface ClientIconProps {
    clientVendor: string
}

const ClientIcon: React.FunctionComponent<ClientIconProps> = ({clientVendor}) => (<Avatar alt={clientVendor} src={"/icons/"+clientVendor+".png"} className="client-icon" component="span"/>);

interface ClientChipProps {
    clientVendor: string
    clientVersion: string
}

const ClientChip: React.FunctionComponent<ClientChipProps> = ({clientVendor, clientVersion}) => (
    <Chip
        avatar={<ClientIcon clientVendor={clientVendor}/>}
        label={(<span><strong>{clientVendor}</strong> <span>{clientVersion}</span></span>)}
        className="client-chip"
        component="a"
        href={`/client/${clientVendor}/${clientVersion}`}
        clickable
    />);

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
    format: (value: TaskData) => any;
}

const columns: Column[] = [
    {id: 'key', label: 'Task', format: (value: TaskData) => value.key},
    {id: 'time', label: 'Time ago', format: (value: TaskData) => <Moment fromNow>{value.created}</Moment>},
    {id: 'spec-version', label: 'Spec Version', format: (value: TaskData) => value.specVersion},
    {id: 'blocks', label: <span>B blocks</span>, format: (value: TaskData) => value.blocks},
    {id: 'clients', label: 'Processing results', format: (value: TaskData) => <div>{Object.entries(value.result).map(([k, v]) => <ClientIcon key={k} clientVendor={v.clientVendor}/>)}</div>},
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

class MainInner extends Component<MainProps, MainState> {

    state: Readonly<MainState> = {};

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root+" main-root"}>
                <div className={classes.headerContents + " header-contents"}>
                    <Container maxWidth="md">
                        <Typography component="h1" variant="h1" className={classes.headerTitle + " header-title"}>Muskoka</Typography>
                    </Container>
                </div>
                <div className={classes.mainContents}>
                    <Container maxWidth="md">
                        <ClientChip clientVendor="pyspec" clientVersion="v0.1.2"/>
                        <ClientChip clientVendor="artemis" clientVersion="v0.3.4"/>
                        <ClientChip clientVendor="lighthouse" clientVersion="v0.5.2"/>
                        <ClientChip clientVendor="harmony" clientVersion="v0.1.4"/>
                        <ClientChip clientVendor="lodestar" clientVersion="v0.6.5"/>
                        <ClientChip clientVendor="nimbus" clientVersion="v0.7.8"/>
                        <ClientChip clientVendor="prysm" clientVersion="v0.4.6"/>
                        <ClientChip clientVendor="shasper" clientVersion="v0.7.3"/>
                        <ClientChip clientVendor="trinity" clientVersion="v0.2.5"/>
                        <ClientChip clientVendor="yeeth" clientVersion="v4.2.0"/>
                    </Container>
                    <Container maxWidth="lg">
                        <div className="table">
                            <Paper className={classes.tableHead + " table-header"}>
                                {columns.map(column => (
                                    <div
                                        key={column.id}
                                        className={"table-col-"+column.id}
                                    >
                                        {column.label}
                                    </div>
                                ))}
                            </Paper>
                            <Paper className="table-body">
                                {rows.map(row => {
                                    return (
                                        <div tabIndex={-1} key={row.key} className="table-row">
                                            {columns.map(column => {
                                                return (
                                                    <div key={column.id}
                                                         className={"table-col-"+column.id}>
                                                        {column.format(row)}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </Paper>
                        </div>
                        <div className="table-navigation">
                            <Fab color="secondary" aria-label="edit">
                                <ArrowLeft />
                            </Fab>
                            <Fab color="secondary" aria-label="edit">
                                <ArrowRight />
                            </Fab>
                        </div>
                    </Container>
                </div>
            </div>
        )
    }
}

export const Main = withStyles(styles)(MainInner);
