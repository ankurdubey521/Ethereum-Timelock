import { ethers } from "hardhat";
import { expect } from "chai";
import type { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("TimeVault", function () {
  let contract: Contract;
  let alice: SignerWithAddress, bob: SignerWithAddress;

  const currentTimestamp = async (): Promise<number> =>
    (await ethers.provider.getBlock(await ethers.provider.getBlockNumber()))
      .timestamp;

  const advanceTimeSeconds = async (seconds: number) => {
    await ethers.provider.send("evm_increaseTime", [seconds - 1]);
    await ethers.provider.send("evm_mine", []); // this adds 1 sec
  };

  before(async () => {
    [alice, bob] = await ethers.getSigners();
  });

  beforeEach(async () => {
    const ContractFactory = await ethers.getContractFactory("TimeVault");
    contract = await ContractFactory.deploy();
  });

  it("Should be able to create ETH Deposit", async function () {
    await expect(
      contract.createEthTimeLockDeposit(
        bob.address,
        (await currentTimestamp()) + 1000,
        {
          value: 1000,
        }
      )
    )
      .to.emit(contract, "TimeLockDepositCreated")
      .withArgs(1);

    expect((await contract.depositIdToDeposit(1))[7]).equals(false);
  });

  it("Should be able to claim ETH after locking period has passed", async function () {
    await contract.createEthTimeLockDeposit(
      bob.address,
      (await currentTimestamp()) + 1000,
      {
        value: 1000,
      }
    );

    await advanceTimeSeconds(1000);

    await expect(
      async () => await contract.connect(bob).claimDeposit(1)
    ).to.changeEtherBalances([bob, contract], [1000, -1000]);

    expect((await contract.depositIdToDeposit(1))[7]).equals(true);
  });

  it("Should revert if claim is called during locking period", async function () {
    const releaseTimeStamp = (await currentTimestamp()) + 1000;
    await contract.createEthTimeLockDeposit(bob.address, releaseTimeStamp, {
      value: 1000,
    });

    while ((await currentTimestamp()) < releaseTimeStamp) {
      await expect(contract.connect(bob).claimDeposit(1)).to.be.revertedWith(
        "ERR__DEPOSIT_RELEASE_TIME_IN_FUTURE"
      );
      await advanceTimeSeconds(10);
    }
  });

  it("Should revert if claim is attempted twice", async function () {
    await contract.createEthTimeLockDeposit(
      bob.address,
      (await currentTimestamp()) + 1000,
      {
        value: 1000,
      }
    );

    await advanceTimeSeconds(1000);

    await expect(
      async () => await contract.connect(bob).claimDeposit(1)
    ).to.changeEtherBalances([bob, contract], [1000, -1000]);

    await expect(contract.connect(bob).claimDeposit(1)).to.be.revertedWith(
      "ERR__DEPOSIT_ALREADY_CLAIMED"
    );
  });

  it("Should revert if no ETH is passed when ETH deposit is created", async function () {
    await expect(
      contract.createEthTimeLockDeposit(
        bob.address,
        (await currentTimestamp()) + 1000
      )
    ).to.be.revertedWith("ERR__NO_ETH_SUPPLIED");
  });

  it("Should revert if release time is in the past", async function () {
    await expect(
      contract.createEthTimeLockDeposit(
        bob.address,
        (await currentTimestamp()) - 1
      )
    ).to.be.revertedWith("ERR__INVALID_TIMESTAMP");
  });
});
