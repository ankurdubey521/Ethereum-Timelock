import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useWeb3React } from "@web3-react/core";

import { TimeVaultUtil } from "../ethereum/TimeVaultUtil";
import { ITimeLockDeposit } from "../types/interfaces";
import OutboundDepositCard from "./OutboundDepositCard";

const useStyles = makeStyles({
  paper: {
    padding: 10,
  },
});

export default function OutboundDepositsList(): JSX.Element {
  const classes = useStyles();
  const { account, library, chainId } = useWeb3React();
  const [outboundDeposits, setOutboundDeposits] = useState<ITimeLockDeposit[]>(
    []
  );

  useEffect(() => {
    try {
      (async () => {
        const timeVaultUtil = new TimeVaultUtil(library.getSigner(account));
        const deposits = await timeVaultUtil.getDepositsByDepositor(
          account as string
        );
        deposits.sort(
          (a, b) =>
            b.minimumReleaseTimestamp.toNumber() -
            a.minimumReleaseTimestamp.toNumber()
        );
        setOutboundDeposits(deposits);
      })();
    } catch (e) {
      console.error("Failed to fetch inbound deposits: ", e);
    }
  }, [account, chainId]);

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Grid container justifyContent="center">
            <Grid item>
              <Typography variant="h5">OUTBOUND DEPOSITS</Typography>
            </Grid>
          </Grid>
        </Grid>
        {outboundDeposits.map((deposit) => (
          <Grid item xs={12} key={deposit.depositId.toNumber()}>
            <OutboundDepositCard deposit={deposit} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
