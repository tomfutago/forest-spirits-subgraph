import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { ForestSpirit } from "../../generated/schema";
import { ipfs, json, JSONValue } from '@graphprotocol/graph-ts';
import { ZERO, IPFS_HASH } from "../utils/constants";

/***** NFT functions *****/
export function get(
  id: string,
  contractAddress: Address,
  tokenID: BigInt,
  block: BigInt,
  hash: Bytes,
  timestamp: BigInt,
  walletAddress: Address
): ForestSpirit {
  let spirit = ForestSpirit.load(id);
  if (!spirit) {
    spirit = new ForestSpirit(id);
    spirit.project = contractAddress.toHexString();
    spirit.tokenID = tokenID;
    spirit.block = block;
    spirit.hash = hash;
    spirit.timestamp = timestamp;
    
    spirit.totalSales = ZERO;
    spirit.totalSalesWei = ZERO;
    spirit.avgSaleWei = ZERO;
    spirit.totalTransfers = ZERO;
  
    spirit.tokenURI = IPFS_HASH + "/" + tokenID.toString();
    let metadata = ipfs.cat(spirit.tokenURI);
    if (metadata) {
      const value = json.fromBytes(metadata).toObject();
      if (value) {
        const name = value.get("name");
        if (name) {
          spirit.name = name.toString();
        }
  
        const image = value.get("image");
        if (image) {
          spirit.image = image.toString();
        }
  
        const animation_url = value.get("animation_url");
        if (animation_url) {
          spirit.animation_url = animation_url.toString();
        }
      }
  
      let attributes: JSONValue[];
      let spiritAttributes = value.get("attributes");
      if (spiritAttributes) {
        attributes = spiritAttributes.toArray();
  
        for (let i=0; i<attributes.length; i++) {
          let item = attributes[i].toObject();
          let trait: string;
          let traitName = item.get("trait_type");
          if (traitName) {
            trait = traitName.toString();
            let value: string;
            let traitValue = item.get("value");
            if (traitValue) {
              value = traitValue.toString();
              if (trait == "Body") {
                spirit.body = value;
              }
              if (trait == "Mask") {
                spirit.mask = value;
              }
              if (trait == "Staff") {
                spirit.staff = value;
              }
              if (trait == "Element") {
                spirit.element = value;
              }
              if (trait == "Pedestal") {
                spirit.pedestal = value;
              }
              if (trait == "Environment") {
                spirit.environment = value;
              }
              if (trait == "Ancestor") {
                spirit.ancestor = value;
              }
              if (trait == "Origin") {
                spirit.origin = value;
              }
            }
          }
        }
      }
    }
  }
  spirit.currentOwner = walletAddress.toHexString();
  spirit.save();

  return spirit as ForestSpirit;
}
