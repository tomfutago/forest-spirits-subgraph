import { Address } from "@graphprotocol/graph-ts";
import { Token as TokenContract } from "../../generated/Token/Token";
import { Project, Account } from "../../generated/schema";
import { ZERO } from "../utils/constants";

/***** Project functions *****/
export function get(contractAddress: Address): Project {
  let project = Project.load(contractAddress.toHexString());
  if (!project) {
    let tokenContract = TokenContract.bind(contractAddress);
    project = new Project(contractAddress.toHexString());
    project.name = tokenContract.name();
    project.symbol = tokenContract.symbol();
    project.totalMinted = ZERO;
    project.totalSales = ZERO;
    project.totalTransfers = ZERO;
    project.totalSalesWei = ZERO;
    project.avgSaleWei = ZERO;
    project.buyers = [];
    project.sellers = [];
    project.save();
  }
  return project as Project;
}

// appends a buyer to project.buyers array if it doesn't exist
export function addBuyer(project: Project, buyer: Account): void {
  let buyers = project.buyers;
  if (!buyers.includes(buyer.id)) {
    buyers.push(buyer.id);
    project.buyers = buyers;
  }
  project.save();
}

// appends a seller to project.sellers array if it doesn't exist
export function addSeller(project: Project, seller: Account): void {
  let sellers = project.buyers;
  if (!sellers.includes(seller.id)) {
    sellers.push(seller.id);
    project.sellers = sellers;
  }
  project.save();
}
