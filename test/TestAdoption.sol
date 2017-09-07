pragma solidity ^0.4.11;

import "truffle/Assert.sol"; //gives various assetions to use in tests
import "truffle/DeployedAddresses.sol"; // Truffle can deploy fresh instance of contract for each test
import "../contracts/Adoption.sol"; //the contract we are testing

contract TestAdoption {
    Adoption adoption = Adoption(DeployedAddresses.Adoption()); //setting up a contract wide variable containing the contract

    function testUserCanAdoptPet() {
        uint returnedId = adoption.adopt(8);
        uint expected = 8;
        Assert.equal(returnedId, expected, "Adoption of pet ID 8 should be recorded");
        //above will be printed to the console if test does not pass
    }

    function testGetAdopterAddressByPetId() {
        address expected = this; // equal to the current users contract address
        address adopter = adoption.adopters(8); //should be equal if we just adopted pet in slot 8 of array for this user
        Assert.equal(adopter, expected, "Owner of pet Id 8 should be recorded");
    }

    function testGetAdopterAddressByPetIdInArray() {
        address expected = this;
        address[16] memory adopters = adoption.getAdopters(); // temporarily store this value in memory
        Assert.equal(adopters[8], expected, "Owner of pet ID 8 should be recorded");
    }
}