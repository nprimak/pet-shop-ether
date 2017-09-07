/**
 * Created by nprimak on 9/7/17.
 */
var Adoption = artifacts.require("./Adoption.sol");

module.exports = function(deployer) {
  deployer.deploy(Adoption); //deploying contract to locally running test blockchain
};