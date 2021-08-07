import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useWeb3React } from "@web3-react/core";
import { Decimal } from "decimal.js";
import { ethers } from "ethers";

import { TimeVaultUtil } from "../ethereum/TimeVaultUtil";
import { ERC20Util } from "../ethereum/ERC20Util";
import { TimeLockDepositType } from "../types/interfaces";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function CreateDepositDialog(): JSX.Element {
  const { library, account } = useWeb3React();
  const signer: ethers.Signer = library.getSigner(account);
  const [open, setOpen] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [unlockDate, setUnlockDate] = useState<Date | null>(new Date());
  const [depositType, setDepositType] = useState<TimeLockDepositType>(
    TimeLockDepositType.ETH
  );
  const [amount, setAmount] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const toIsoString = (date: Date): string => {
    var tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? "+" : "-",
      pad = function (num: number) {
        var norm = Math.floor(Math.abs(num));
        return (norm < 10 ? "0" : "") + norm;
      };

    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds()) +
      dif +
      pad(tzo / 60) +
      ":" +
      pad(tzo % 60)
    );
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createEthDeposit = async () => {
    try {
      const actualTokenAmount = ethers.BigNumber.from(
        new Decimal(amount).mul(new Decimal(10).pow(18)).toFixed()
      );
      const timeVaultUtil = new TimeVaultUtil(signer);

      setStatusMessage("Creating Deposit...");
      await timeVaultUtil.createEthTimeLockDeposit(
        recipientAddress as string,
        Math.floor((unlockDate?.getTime() as number) / 1000),
        actualTokenAmount
      );
      setStatusMessage("");
      handleClose();
      window.location.reload(false);
    } catch (e) {
      console.error("Error Creating ERC20 Deposit: ", e);
    }
  };

  const createErc20Deposit = async () => {
    try {
      const erc20token = new ERC20Util(signer, tokenAddress as string);
      const decimals = await erc20token.decimals();
      const actualTokenAmount = ethers.BigNumber.from(
        new Decimal(amount).mul(new Decimal(10).pow(decimals)).toFixed()
      );
      const timeVaultUtil = new TimeVaultUtil(signer);
      setStatusMessage("Processing Token Approval...");
      await erc20token.approve(
        process.env.REACT_APP_CONTRACT_ADDRESS as string,
        actualTokenAmount
      );

      setStatusMessage("Creating Deposit...");
      await timeVaultUtil.createErc20TimeLockDeposit(
        recipientAddress as string,
        Math.floor((unlockDate?.getTime() as number) / 1000),
        tokenAddress as string,
        actualTokenAmount
      );
      setStatusMessage("");
      handleClose();
      window.location.reload(false);
    } catch (e) {
      console.error("Error Creating ERC20 Deposit: ", e);
    }
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={handleClickOpen}
      >
        Create Deposit
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Deposit</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Recipient Address"
            type="text"
            fullWidth
            onChange={(event) => setRecipientAddress(event.target.value)}
          />
          <FormControl>
            <RadioGroup
              value={
                {
                  [TimeLockDepositType.ETH]: "ETH",
                  [TimeLockDepositType.ERC20]: "ERC20",
                }[depositType]
              }
              onChange={(event) =>
                setDepositType(
                  {
                    ETH: TimeLockDepositType.ETH,
                    ERC20: TimeLockDepositType.ERC20,
                  }[event.target.value] as TimeLockDepositType
                )
              }
            >
              <Grid container>
                <Grid item>
                  <FormControlLabel
                    value="ETH"
                    control={<Radio />}
                    label="ETH"
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    value="ERC20"
                    control={<Radio />}
                    label="ERC20"
                  />
                </Grid>
              </Grid>
            </RadioGroup>
          </FormControl>
          {depositType === TimeLockDepositType.ERC20 && (
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Token"
              type="text"
              fullWidth
              onChange={(event) => setTokenAddress(event.target.value)}
            />
          )}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Unlock Date"
            type="datetime-local"
            defaultValue={toIsoString(new Date()).slice(0, 19)}
            fullWidth
            onChange={(event) => setUnlockDate(new Date(event.target.value))}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Amount"
            type="number"
            fullWidth
            onChange={(event) => setAmount(parseFloat(event.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await {
                [TimeLockDepositType.ETH]: createEthDeposit,
                [TimeLockDepositType.ERC20]: createErc20Deposit,
              }[depositType]();
            }}
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
        {statusMessage !== "" && (
          <>
            <Alert severity="info">{statusMessage}</Alert>
            <LinearProgress />
          </>
        )}
      </Dialog>
    </div>
  );
}
