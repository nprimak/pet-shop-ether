pragma solidity ^0.4.4;

contract Adoption {
    address[16] public adopters; // an array of ethereum addresses

    function adopt(uint petId) public returns (uint) {
        require(petId >= 0 && petId <= 15); //checking that petId is in range of our adopters array

        adopters[petId] = msg.sender; // add address that made the call to this function to our adopters array

        return petId;
    }

    function getAdopters() public returns (address[16]) {
        return adopters;
    }


}