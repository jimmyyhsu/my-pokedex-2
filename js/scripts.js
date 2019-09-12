
var pokemonRepository = (function() {    //Start of IIFE
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  var $modalContainer = $('#modal-container');
  var $pokemonList = $('ul');

  //Function to add new Pokemon data
  function add(pokemon) {
    //Must be an 'object' type
    if (typeof pokemon !== 'object') {
      return 'Not a valid input'
    }else{
    repository.push(pokemon);
    }
  }

  //Function to pull all Pokemon data
  function getAll() {
    return repository;
  }

  //Function to add list for each pokemon object
  function addListItem(pokemon) {
    var $listItem = $('<li></li>');
    $pokemonList.append($listItem);
    var $button = $('<button class="pokemon-name">' + pokemon.name + '</button>');
    $listItem.append($button);
    $button.on('click', function() {
      showDetails(pokemon)
    })
  }

  //Function to load pokemon list from API
  function loadList() {
    return fetch(apiUrl).then(function(response) {
      return response.json();
    }).then(function(json) {
      json.results.forEach(function(item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function(e) {
      console.error(e);
    })
  }

  function loadDetails(item) {
    var url = item.detailsUrl;
    return fetch(url).then(function(response) {
      return response.json();
    }).then(function(details) {
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.weight = details.weight;
      item.types = Object.keys(details.types);
    }).catch(function(e) {
      console.error(e);
    })
  }

  //Funtion to create reusable modal
  function createReusableModal() {

    var $modal = $('<div class="modal"></div>');
    $modalContainer.append($modal);
    var $modalElement1 = $('<div></div>');
    $modal.append($modalElement1);
    var $modalElement2 = $('<div class="pokemon-info"></div>');
    $modal.append($modalElement2);

    var $closeButtonElement = $('<button class="modal-close">Close</button>');
    $modalElement1.append($closeButtonElement);

    var $nameElement = $('<h1></h1>');
    $modalElement2.append($nameElement);
    var $imageElement = $('<img class="pokemon-img">');
    $modalElement2.append($imageElement);
    var $heightElement = $('<p></p>');
    $modalElement2.append($heightElement);
  }

  //Function to show modal for Pokemon data
  function showModal(item) {
    console.log('TCL: showModal -> item', item.name.charAt(0).toUpperCase() + item.name.slice(1));

    //create element for Pokemon name
    var nameElement = document.querySelector('h1');
    nameElement.innerText = item.name.charAt(0).toUpperCase() + item.name.slice(1);

    var imageElement = document.querySelector('.pokemon-img');
    imageElement.setAttribute('src', item.imageUrl);

    var heightElement = document.querySelector('p');
    heightElement.innerText = 'Height: ' + item.height;

    $modalContainer.addClass('is-visible');
  }

  //Function to hide modal
  function hideModal() {
    //var $modalContainer = document.querySelector('#modal-container');
    $modalContainer.removeClass('is-visible');
  }

  //Function to show details of each Pokemon
  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function() {
      console.log(item);
      return item;
    }).then(function(item) {
      console.log('TCL: showDetails -> item', item);
      showModal(item);
    });
  }

  $modalContainer.on('keydown', function(e) {
    if (e.key === 'Escape' && $modalContainer.classList.contains('is-visible')) {
      hideModal();
    }
  });

  $modalContainer.on('click', (e) => {
    // Since this is also triggered when clicking INSIDE the modal
    // We only want to close if the user clicks directly on the overlay
    var target = e.target;
    console.log('TCL: pokemonRepository -> target', target);
    var $modalClose = $('.modal-close');
    if (target === $modalContainer || $modalClose) {
      hideModal();
    }
  })

  return{
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    showDetails: showDetails,
    loadList: loadList,
    loadDetails: loadDetails,
    createReusableModal: createReusableModal,
    showModal: showModal,
    hideModal: hideModal
  };
})();


//Creates list of Pokemon with Pokemon's name on the button
pokemonRepository.loadList().then(function() {
  //Create a reusable modal once
  pokemonRepository.createReusableModal();
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});
