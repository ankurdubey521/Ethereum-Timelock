//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract TimeVault {
  using SafeERC20 for IERC20;

  enum TimeLockDepositType {
    ERC20,
    ETH
  }

  struct TimeLockDeposit {
    uint256 depositId;
    address depositor;
    address payable receiver;
    IERC20 erc20token;
    TimeLockDepositType depositType;
    uint256 minimumReleaseTimestamp;
    uint256 amount;
    bool claimed;
  }

  uint256 private _nextDepositId = 1;

  mapping(uint256 => TimeLockDeposit) private _depositIdToDeposit;
  mapping(address => uint256[]) private _depositorAddressToDeposits;
  mapping(address => uint256[]) private _receiverAddressToDeposits;

  event TimeLockDepositCreated(uint256 depositId);
  event TimeLockDepositClaimed(uint256 depositId);

  function createEthTimeLockDeposit(
    address payable receiver,
    uint256 minimumReleaseTimestamp
  ) external payable {
    require(receiver != address(0), "ERR__INVAID_RECEIVER");
    require(
      minimumReleaseTimestamp >= block.timestamp,
      "ERR__INVALID_TIMESTAMP"
    );
    require(msg.value > 0, "ERR__NO_ETH_SUPPLIED");

    address depositor = msg.sender;
    TimeLockDeposit memory timeLockDeposit = TimeLockDeposit(
      _nextDepositId,
      depositor,
      receiver,
      IERC20(address(0)),
      TimeLockDepositType.ETH,
      minimumReleaseTimestamp,
      msg.value,
      false
    );
    _depositIdToDeposit[timeLockDeposit.depositId] = timeLockDeposit;
    _depositorAddressToDeposits[timeLockDeposit.depositor].push(
      timeLockDeposit.depositId
    );
    _receiverAddressToDeposits[timeLockDeposit.receiver].push(
      timeLockDeposit.depositId
    );
    _nextDepositId += 1;

    emit TimeLockDepositCreated(timeLockDeposit.depositId);
  }

  function createErc20TimeLockDeposit(
    address payable receiver,
    uint256 minimumReleaseTimestamp,
    IERC20 tokenAddress,
    uint256 amount
  ) external {}

  function claimDeposit(uint256 depositId) external {
    require(depositId < _nextDepositId, "ERR__INVALID_DEPOSIT_ID");
    TimeLockDeposit memory timeLockDeposit = _depositIdToDeposit[depositId];
    require(
      timeLockDeposit.minimumReleaseTimestamp <= block.timestamp,
      "ERR__DEPOSIT_RELEASE_TIME_IN_FUTURE"
    );
    require(!timeLockDeposit.claimed, "ERR__DEPOSIT_ALREADY_CLAIMED");

    _depositIdToDeposit[depositId].claimed = true;

    if (timeLockDeposit.depositType == TimeLockDepositType.ETH) {
      _claimEthTimeLockDeposit(timeLockDeposit);
    } else if (timeLockDeposit.depositType == TimeLockDepositType.ERC20) {
      _claimErc20TimeLockDeposit(timeLockDeposit);
    } else {
      revert("INTERNAL_ERROR_INVALID_DEPOSIT_TYPE");
    }

    emit TimeLockDepositClaimed(depositId);
  }

  function _claimEthTimeLockDeposit(TimeLockDeposit memory timeLockDeposit)
    internal
  {
    timeLockDeposit.receiver.transfer(timeLockDeposit.amount);
  }

  function _claimErc20TimeLockDeposit(TimeLockDeposit memory timeLockDeposit)
    internal
  {}
}
