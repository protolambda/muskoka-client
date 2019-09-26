import React from "react";
import {Avatar, Chip} from "@material-ui/core";

interface ClientIconProps {
    clientVendor: string
}

export const ClientIcon: React.FunctionComponent<ClientIconProps> = ({clientVendor}) => (
    <Avatar alt={clientVendor} src={"/icons/" + clientVendor + ".png"} className="client-icon" component="span"/>);

interface ClientChipProps {
    clientVendor: string
    clientVersion: string
}

export const ClientChip: React.FunctionComponent<ClientChipProps> = ({clientVendor, clientVersion}) => (
    <Chip
        avatar={<ClientIcon clientVendor={clientVendor}/>}
        label={(<span><strong>{clientVendor}</strong> <span>{clientVersion}</span></span>)}
        className="client-chip"
        component="a"
        href={`/client/${clientVendor}/${clientVersion}`}
        clickable
    />);
