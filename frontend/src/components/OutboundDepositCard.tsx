import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Countdown from "react-countdown";
import { Decimal } from "decimal.js";
import { useWeb3React } from "@web3-react/core";

import { ERC20Util } from "../ethereum/ERC20Util";
import {
  IOutboundDepositProps,
  TimeLockDepositType,
} from "../types/interfaces";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    fontSize: 14,
  },
  p: {
    marginTop: 10,
  },
});

export default function OutboundDepositCard(props: IOutboundDepositProps) {
  const classes = useStyles();
  const { library, chainId, account } = useWeb3React();
  const [decimals, setDecimals] = useState<number | null>(null);
  const [displayAmount, setDisplayAmount] = useState<Decimal | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (props.deposit.depositType === TimeLockDepositType.ETH) {
          setDecimals(18);
        } else {
          const erc20util = new ERC20Util(
            library.getSigner(account),
            props.deposit.erc20Token as string
          );
          setDecimals(await erc20util.decimals());
        }
      } catch (e) {
        console.log("Error retrieving decimals: ", e);
        setDecimals(null);
      }
    })();
  }, [props.deposit, account, chainId]);

  useEffect(() => {
    if (decimals != null) {
      setDisplayAmount(
        new Decimal(props.deposit.amount.toString()).div(
          new Decimal(10).pow(decimals)
        )
      );
    } else {
      setDisplayAmount(null);
    }
  }, [decimals]);

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography variant="h6" component="h2">
          {displayAmount != null && <>{displayAmount.toString()}</>}{" "}
          {props.deposit.depositType === TimeLockDepositType.ETH
            ? "ETH"
            : "Tokens"}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Deposit ID: {props.deposit.depositId.toString()}
          <br />
          Sent To: {props.deposit.receiver}
        </Typography>
        {props.deposit.depositType === TimeLockDepositType.ERC20 && (
          <Typography className={classes.pos} color="textSecondary">
            Token: {props.deposit.erc20Token}
          </Typography>
        )}
        <Typography variant="body2" component="p" className={classes.p}>
          {props.deposit.claimed ? (
            "Claimed"
          ) : (
            <>
              {`Deposit can be claimed after ${new Date(
                props.deposit.minimumReleaseTimestamp.toNumber() * 1000
              ).toLocaleString()}`}
              <br />
              Time Remaining:{" "}
              <Countdown
                date={
                  new Date(
                    props.deposit.minimumReleaseTimestamp.toNumber() * 1000
                  )
                }
              />
            </>
          )}
        </Typography>
      </CardContent>
    </Card>
  );
}
