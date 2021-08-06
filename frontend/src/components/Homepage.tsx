import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";

import Titlebar from "./Titlebar";
import InboundDepositsList from "./InboundDepositsList";
import OutboundDepositsList from "./OutboundDepositsList";
import { useWeb3React } from "@web3-react/core";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  container: {
    paddingTop: 20,
  },
});

const Homepage = (): JSX.Element => {
  const classes = useStyles();
  const { account } = useWeb3React();
  return (
    <>
      <Titlebar />
      {account && (
        <Grid
          container
          spacing={2}
          justifyContent="center"
          className={classes.container}
        >
          <Grid item xs={3}>
            <OutboundDepositsList />
          </Grid>
          <Grid item xs={3}>
            <InboundDepositsList />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Homepage;
