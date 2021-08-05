import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useWeb3React } from "@web3-react/core";
import { Injected } from "../connectors/connectors";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Titlebar() {
  const classes = useStyles();
  const { activate, deactivate, active, account } = useWeb3React();

  useEffect(() => {
    (async () => {
      const isAuthorized: boolean = await Injected.isAuthorized();
      if (isAuthorized) {
        await activate(Injected, undefined, true);
      }
    })();
  }, []);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            TimeLock
          </Typography>
          {active && <div>{account}</div>}
          <Button
            color="inherit"
            onClick={async () => {
              await (active ? deactivate() : activate(Injected));
            }}
          >
            {active ? "Disconnect" : "Connect"}
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
