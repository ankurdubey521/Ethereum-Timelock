import React, { useState, useContext } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useWeb3React } from "@web3-react/core";
import { Decimal } from "decimal.js";
import { ethers } from "ethers";

import { TimeVaultUtil } from "../ethereum/TimeVaultUtil";
import { ERC20Util } from "../ethereum/ERC20Util";
import { ProviderContext } from "../context/providercontext";

export default function CreateDepositDialog(): JSX.Element {
  const { library, account } = useWeb3React();
  const { websocketProvider } = useContext(ProviderContext);
  const signer: ethers.Signer = library.getSigner(account);
  const [open, setOpen] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [unlockDate, setUnlockDate] = useState<Date | null>(new Date());
  const [amount, setAmount] = useState<number>(0);

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

  const createErc20Deposit = async () => {
    try {
      const erc20token = new ERC20Util(signer, tokenAddress as string);
      const decimals = await erc20token.decimals();
      const actualTokenAmount = ethers.BigNumber.from(
        new Decimal(amount).mul(new Decimal(10).pow(decimals)).toFixed()
      );
      const timeVaultUtil = new TimeVaultUtil(signer);
      await erc20token.approve(
        process.env.REACT_APP_CONTRACT_ADDRESS as string,
        actualTokenAmount
      );

      /*      websocketProvider.once(
        {
          address: tokenAddress,
          topics: [ethers.utils.id("Approval(address,address,uint256)")],
        },
        async () => { 
          console.log("called");
          */
      await timeVaultUtil.createErc20TimeLockDeposit(
        recipientAddress as string,
        Math.floor((unlockDate?.getTime() as number) / 1000),
        tokenAddress as string,
        actualTokenAmount
      );
      //}
      //);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
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
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Token"
            type="text"
            fullWidth
            onChange={(event) => setTokenAddress(event.target.value)}
          />
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
          <Button onClick={createErc20Deposit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
