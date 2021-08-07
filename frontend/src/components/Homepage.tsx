import React from "react";
import Grid from "@material-ui/core/Grid";

import Titlebar from "./Titlebar";
import InboundDepositsList from "./InboundDepositsList";
import OutboundDepositsList from "./OutboundDepositsList";
import CreateDepositDialog from "./CreateDepositDialog";
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
      <Grid container justifyContent="center" className={classes.container}>
        {account && (
          <>
            <Grid item xs={6}>
              <CreateDepositDialog />
            </Grid>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              item
              xs={12}
              className={classes.container}
            >
              <Grid item xs={3}>
                <OutboundDepositsList />
              </Grid>
              <Grid item xs={3}>
                <InboundDepositsList />
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default Homepage;
