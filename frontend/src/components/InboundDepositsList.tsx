import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { useWeb3React } from "@web3-react/core";

import InboundDepositCard from "./InboundDepositCard";
import { TimeVaultUtil } from "../ethereum/TimeVaultUtil";
import { ITimeLockDeposit } from "../types/interfaces";

export default function InboundDepositsList(): JSX.Element {
  const { account, library, chainId } = useWeb3React();
  const [inboundDeposits, setInboundDeposits] = useState<ITimeLockDeposit[]>(
    []
  );

  useEffect(() => {
    try {
      (async () => {
        const timeVaultUtil = new TimeVaultUtil(library.getSigner(account));
        const deposits = await timeVaultUtil.getDepositsByReceiver(
          account as string
        );
        deposits.sort(
          (a, b) =>
            b.minimumReleaseTimestamp.toNumber() -
            a.minimumReleaseTimestamp.toNumber()
        );
        setInboundDeposits(deposits);
      })();
    } catch (e) {
      console.error("Failed to fetch inbound deposits: ", e);
    }
  }, [account, chainId]);

  return (
    <Grid container spacing={1}>
      {inboundDeposits.map((deposit) => (
        <Grid item xs={12}>
          <InboundDepositCard deposit={deposit} />
        </Grid>
      ))}
    </Grid>
  );
}