import { Project, Account, ForestSpirit, TransferEvent } from "../../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { ONE, ZERO_ADDRESS } from "../utils/constants";

export function create(
  nft: ForestSpirit,
  project: Project,
  from: Account,
  to: Account,
  block: BigInt,
  hash: Bytes,
  timestamp: BigInt
): void {
  /* Record the new transfer event */
  let transferId = nft.id.concatI32(nft.totalTransfers.toI32());

  let transfer = new TransferEvent(transferId);

  transfer.idx = nft.totalTransfers;
  transfer.project = project.id;
  transfer.nft = nft.id;
  transfer.from = from.id;
  transfer.to = to.id;
  transfer.block = block;
  transfer.hash = hash;
  transfer.timestamp = timestamp;
  transfer.isMint = false;

  // mint
  if (from.id == ZERO_ADDRESS) {
    transfer.isMint = true;
    project.totalMinted = project.totalMinted.plus(ONE);
  }

  // increment the transfer counts
  project.totalTransfers = project.totalTransfers.plus(ONE);
  nft.totalTransfers = nft.totalTransfers.plus(ONE);
  from.totalSent = from.totalSent.plus(ONE);
  to.totalReceived = to.totalReceived.plus(ONE);

  // graph mutation
  project.save();
  nft.save();
  from.save();
  to.save();
  transfer.save();
}
