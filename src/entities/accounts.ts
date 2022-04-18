import { Address } from "@graphprotocol/graph-ts";
import { Account } from "../../generated/schema";
import { ZERO } from "../utils/constants";

/***** Account functions *****/
export function get(walletAddress: Address): Account {
  let account = Account.load(walletAddress);
  if (!account) {
    account = new Account(walletAddress);
    account.totalBought = ZERO;
    account.totalBoughtWei = ZERO;
    account.avgBoughtWei = ZERO;
    account.totalSold = ZERO;
    account.totalSoldWei = ZERO;
    account.avgSoldWei = ZERO;
    account.totalSent = ZERO;
    account.totalReceived = ZERO;
    account.save();
  }
  return account as Account;
}
