import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";

import Titlebar from "./Titlebar";
import InboundDepositsList from "./InboundDepositsList";
import { useWeb3React } from "@web3-react/core";

const Homepage = (): JSX.Element => {
  const { account } = useWeb3React();
  return (
    <>
      <Titlebar />
      {account && (
        <Grid container justifyContent="center">
          <Grid item xs={4}>
            <InboundDepositsList />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Homepage;
