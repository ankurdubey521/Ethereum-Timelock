import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
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

export default function Titlebar(): JSX.Element {
  const classes = useStyles();
  const { activate, deactivate, active, account } = useWeb3React();
  const {
    activate: biconomyActivate,
    deactivate: biconomyDeactivate,
    active: biconomyActive,
  } = useWeb3React("biconomy");

  useEffect(() => {
    (async () => {
      const isAuthorized: boolean = await Injected.isAuthorized();
      if (isAuthorized) {
        await activate(Injected, undefined, true);
        await biconomyActivate(Injected, undefined, true);
      }
    })();
  }, []);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Grid container>
            <Grid item xs={6} container justifyContent="flex-start">
              <Typography variant="h6" className={classes.title}>
                TimeLock
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              container
              spacing={2}
              alignItems="center"
              justifyContent="flex-end"
            >
              {active && (
                <Grid item>
                  <Typography variant="button">{account}</Typography>
                </Grid>
              )}
              <Grid item>
                <Button
                  color="inherit"
                  onClick={async () => {
                    await (active ? deactivate() : activate(Injected));
                    await (biconomyActive
                      ? biconomyDeactivate()
                      : biconomyActivate(Injected));
                  }}
                >
                  {active ? "Disconnect" : "Connect with Metamask"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}
