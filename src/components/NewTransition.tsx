import React, {Component} from 'react';
import {
    Button,
    createStyles,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
    TextField,
    Theme,
    Typography,
    withStyles,
    WithStyles
} from "@material-ui/core";
import {SortableHandle, SortableContainer, SortableElement} from 'react-sortable-hoc';
import {CubeOutline, ReorderHorizontal} from "mdi-material-ui";
import arrayMove from 'array-move';

type State = {
    preStateFile: undefined | File,
    blockFileList: undefined | FileList,
    blockFileIndices: Array<number>,
    specVersion: string,
}

const styles = (theme: Theme) => {
    const light = theme.palette.type === 'light';
    return createStyles({
        root: {
            width: "100%",
            backgroundColor: light ? '#ffcd4c' : '#1d1d1d',
            color: light ? '#333333' : '#cccccc',
        },
        specVersionInput: {
            minWidth: '7em',
            maxWidth: '10em'
        },
        preStateInput: {
            display: "none",
        },
        blocksInput: {
            display: "none",
        },
        submitInput: {
            display: "none",
        },
        preStateBtn: {
            margin: theme.spacing(1),
        },
        blocksBtn: {
            margin: theme.spacing(1),
        },
        submitBtn: {
            margin: theme.spacing(1),
        },
    });
};

interface Props extends WithStyles<typeof styles> {
}

const BlockDragHandle = SortableHandle(() => <ReorderHorizontal/>
);

const SortableBlockItem = SortableElement((args: { value: File | undefined }) =>
    <ListItem>
        <ListItemAvatar>
            <CubeOutline/>
        </ListItemAvatar>
        {args.value === undefined
            ? <ListItemText
                primary="?"
                secondary="?"
            />
            : <ListItemText
                primary={args.value.name}
                secondary={args.value.lastModified.toString()}
            />
        }
        <ListItemSecondaryAction>
            <BlockDragHandle/>
        </ListItemSecondaryAction>
    </ListItem>
);

const SortableBlocksList = SortableContainer((args: { key: string, items: Array<File | undefined> }) => (
    <List dense={true}>
        {args.items.map((value, index) => (
            <SortableBlockItem key={`item-${args.key}-${index}`} index={index} value={value}/>
        ))}
    </List>
));

class NewTransition extends Component<Props, State> {

    state: Readonly<State> = {
        preStateFile: undefined,
        blockFileList: undefined,
        blockFileIndices: [],
        specVersion: "v0.8.3",
    };

    onChangeSpecVersion = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({specVersion: e.target.value as string || ""});
    };

    onChangePreState = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e);
        this.setState({
            preStateFile: (e.target.files && e.target.files.length > 0) ? e.target.files[0] : undefined,
        }, () => {
            console.log('pre file', this.state.preStateFile);
        });
    };

    onChangeBlocks = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e);
        this.setState({
            blockFileList: (e.target.files && e.target.files.length > 0) ? e.target.files : undefined,
            blockFileIndices: (e.target.files && e.target.files.length > 0) ? [...Array(e.target.files.length)].map((_, i) => i) : [],
        }, () => {
            console.log('block files', this.state.blockFileList);
        });
    };

    onBlocksSortEnd = (args: { oldIndex: number, newIndex: number }) => {
        this.setState(({blockFileIndices}) => ({
            blockFileIndices: arrayMove(blockFileIndices, args.oldIndex, args.newIndex),
        }));
    };

    render() {
        const {classes} = this.props;
        return (
            <Paper className={classes.root}>
                <form
                    encType="multipart/form-data"
                    action="http://localhost:8080/upload"
                    method="post"
                    noValidate
                    autoComplete="off"
                >
                    <Grid container spacing={4} alignItems="flex-start" justify="space-evenly">
                        <Grid item>
                            <TextField
                                id="spec-version"
                                label="Spec version"
                                type="text"
                                className={classes.specVersionInput}
                                name="spec-version"
                                value={this.state.specVersion}
                                onChange={this.onChangeSpecVersion}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item>
                            <label htmlFor="pre-input">
                                <Button component="span" className={classes.preStateBtn} variant="contained" color="primary"
                                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}>
                                    Select pre-state
                                </Button>
                            </label>
                            <input type="file" accept="octet-stream/*,.ssz" name="pre"
                                   onChange={this.onChangePreState}
                                   className={classes.preStateInput} id="pre-input"/>
                            <Divider/>
                            <Typography variant="caption">
                                {this.state.preStateFile === undefined
                                    ? <i>No pre-state selected yet.</i>
                                    : <span>Selected <strong>{this.state.preStateFile.name}</strong></span>}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <div>
                                <label htmlFor="blocks-input">
                                    <Button component="span" className={classes.blocksBtn} variant="contained" color="primary"
                                            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}>
                                        Select blocks
                                    </Button>
                                </label>
                                <input type="file" accept="octet-stream/*,.ssz" name="blocks"
                                       onChange={this.onChangeBlocks}
                                       className={classes.blocksInput} id="blocks-input" multiple={true}/>
                            </div>
                            <Divider/>
                            <Typography variant="caption">Selected {this.state.blockFileIndices.length} blocks</Typography>
                            <Divider/>
                            <SortableBlocksList key={this.state.blockFileIndices.join("_")}
                                                items={this.state.blockFileIndices.map((i) => (this.state.blockFileList === undefined ? undefined : this.state.blockFileList[i]))}
                                                onSortEnd={this.onBlocksSortEnd} useDragHandle/>

                            {/* Send the re-ordering along with the upload. The user can specify the order of blocks.
                        We can't re-order the input filelist itself, due to security restrictions.*/}
                            <input name="blocks-order" hidden={true} value={this.state.blockFileIndices.join(",")}
                                   readOnly={true}/>
                        </Grid>
                        <Grid item>
                            <label htmlFor="submit-transition">
                                <Button component="span" className={classes.submitBtn} variant="contained" color="primary" disabled={
                                    !(this.state.specVersion !== "" && this.state.preStateFile !== undefined
                                        && this.state.blockFileList !== undefined && this.state.blockFileList.length > 0)}>
                                    Submit
                                </Button>
                            </label>
                            <input type="submit" className={classes.submitInput} id="submit-transition"/>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        )
    }
}

export default withStyles(styles)(NewTransition);
