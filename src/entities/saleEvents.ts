import { Project, Account, ForestSpirit, SaleEvent } from "../../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { ONE } from "../utils/constants";

export function create(
  nft: ForestSpirit,
  project: Project,
  from: Account,
  to: Account,
  amount: BigInt,
  block: BigInt,
  hash: Bytes,
  timestamp: BigInt
): void {
  // new sales event
  let saleId = nft.id.concatI32(nft.totalSales.toI32());

  let sale = new SaleEvent(saleId);

  sale.idx = nft.totalSales;
  sale.project = project.id;
  sale.nft = nft.id;
  sale.amount = amount;
  sale.from = from.id;
  sale.to = to.id;
  sale.block = block;
  sale.hash = hash;
  sale.timestamp = timestamp;

  // increment the sales counts
  project.totalSales = project.totalSales.plus(ONE);
  nft.totalSales = nft.totalSales.plus(ONE);
  from.totalSold = from.totalSold.plus(ONE);
  to.totalBought = to.totalBought.plus(ONE);

  // increment the sales amounts
  project.totalSalesWei = project.totalSalesWei.plus(sale.amount);
  nft.totalSalesWei = nft.totalSalesWei.plus(sale.amount);
  from.totalSoldWei = from.totalSoldWei.plus(sale.amount);
  to.totalBoughtWei = to.totalBoughtWei.plus(sale.amount);

  // calculate average sale prices
  project.avgSaleWei = project.totalSalesWei.div(project.totalSales);
  nft.avgSaleWei = nft.totalSalesWei.div(nft.totalSales);
  from.avgSoldWei = from.totalSoldWei.div(from.totalSold);
  to.avgBoughtWei = to.totalBoughtWei.div(to.totalBought);

  // graph mutation
  project.save();
  from.save();
  to.save();
  nft.save();
  sale.save();
}
