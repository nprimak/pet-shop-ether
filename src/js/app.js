App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    //Initialize web3 and set the provider to the test RPC.
      if(typeof web3 !== 'undefined'){
        //If an injected web3 instance is present, we get its provider and use it to create our web3 object.
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        //set the provider you want from Web3.providers
          App.web3Provider = new web3.providers.HttpProvider("http://localhost:8545");
          web3 = new Web3(App.web3Provider);
      }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
      //Get the necessary contract artifact file and instantiate it with truffle-contract
        var AdoptionArtifact = data; //artifact file includes data about our contract. ABI is JS object defining how to interact with the contract
        App.contracts.Adoption = TruffleContract(AdoptionArtifact); //creates instance of the contract

        //Set the provider for our contract
        App.contracts.Adoption.setProvider(App.web3Provider); //provider we created in initWeb3 function

        //User our contract to retrieve and mark the adopted pets in case pets are adopted from previous visit
        return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  handleAdopt: function() {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
       if(error) {
           console.log(error);
       }

       var account = accounts[0];

       App.contracts.Adoption.deployed().then(function(instance) {
           adoptionInstance = instance;

           return adoptionInstance.adopt(petId, {from: account}); //his has a gas/Ether cost
       }).then(function(result) {
           return App.markAdopted();
       }).catch(function(err) {
           console.log(err.message);
        });
    });
  },

  markAdopted: function(adopters, account) {
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call(); //call allows us to read data from blockchain without having to spend Ether
    }).then(function(adopters){
      for (var i = 0; i < adopters.length; i++) {
        if(adopters[i] !== '0x0000000000000000000000000000000000000000'){ //array of type address uses the 0x0 string as initial value
          $('.panel-pet').eq(i).find('button').text('Pending...').attr('disabled', true);
          //disables adopt button so pet can no longer be adopted
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
