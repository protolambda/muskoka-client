import React, {Component} from 'react';
import {Paper} from "@material-ui/core";
import "./Main.css";

type MainState = {

}

interface MainProps {

}

export class Main extends Component<MainProps, MainState> {

    state: Readonly<MainState> = {

    };

    render() {
        return (
            <>
                <Paper className="todo">
                    TODO TODO TODO
                </Paper>
            </>
        )
    }
}
