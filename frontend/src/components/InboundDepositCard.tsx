import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Countdown from "react-countdown";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Decimal } from "decimal.js";
import { useWeb3React } from "@web3-react/core";

import { ERC20Util } from "../ethereum/ERC20Util";
import { TimeVaultUtil } from "../ethereum/TimeVaultUtil";
import { IInboundDepositProps, TimeLockDepositType } from "../types/interfaces";
import { ProviderContext } from "../context/providercontext";

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
  content: {
    paddingBottom: 0,
  },
});

export default function InboundDepositCard(props: IInboundDepositProps) {
  const classes = useStyles();
  const { library, chainId, account } = useWeb3React();
  const { library: biconomyLibrary, account: biconomyAccount } =
    useWeb3React("biconomy");
  const { biconomyInitialized } = useContext(ProviderContext);

  const [decimals, setDecimals] = useState<number | null>(null);
  const [displayAmount, setDisplayAmount] = useState<Decimal | null>(null);
  const [loading, setLoading] = useState(false);

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

  const claim = async () => {
    if (biconomyInitialized) {
      const timeVaultUtil = new TimeVaultUtil(
        biconomyLibrary.getSigner(biconomyAccount)
      );
      setLoading(true);
      await timeVaultUtil.claimDeposit(props.deposit.depositId);
      setLoading(false);
      window.location.reload(false);
    } else {
      console.log("Biconomy Not Initialized");
    }
  };

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent className={classes.content}>
        <Typography variant="h6" component="h2">
          {displayAmount != null && <>{displayAmount.toString()}</>}{" "}
          {props.deposit.depositType === TimeLockDepositType.ETH
            ? "ETH"
            : "Tokens"}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Deposit ID: {props.deposit.depositId.toString()}
          <br />
          Sender: {props.deposit.depositor}
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
      {props.deposit.claimed || (
        <CardActions>
          <Button
            size="small"
            onClick={claim}
            disabled={
              props.deposit.claimed ||
              props.deposit.minimumReleaseTimestamp.toNumber() >
                (new Date().getTime() as number) / 1000
            }
          >
            Claim
          </Button>
        </CardActions>
      )}
      {loading && <LinearProgress />}
    </Card>
  );
}
