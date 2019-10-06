import React from 'react';
import "./KeyDisplay.css"
import {Typography} from "@material-ui/core";

const KeyDisplay: React.FC = ({children}) => (
    <Typography variant="body1" className="key-container">
        <code>
            {children}
        </code>
    </Typography>
);

export default KeyDisplay;
