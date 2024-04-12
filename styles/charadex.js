
/* Sheet Options
----------------------------------------------------------------- */

// Sheet information
let sheetID = "18SMfCx05l0E5CS9DHC2xb6cLY2eRcJ0PjWQRlYATdRE";
let sheetPage = "Masterlist";

// Number of items on the page at a time
let numOfItems = 12;

// Sort order for ascending/descending
// asc/desc
var order = "desc";


/* Only edit below if you know what you're doing!
----------------------------------------------------------------- */

// Sheet URL
let sheetUrl = "https://docs.google.com/spreadsheets/d/" + sheetID + "/gviz/tq?tqx=out:json&sheet=" + sheetPage;

// Dah Page URL
let pageURL = window.location.href;

// URL without any bits
let vanillaURL = pageURL.split('?')[0];

// Pulls ID from URL
let designID = pageURL.split('=')[1];

// All values from the google sheet will be
// pushed here to be called later on
let keys = [];
let values = [];
let bigArr = [];

// Fetches the sheet and gets to work on it
fetch(sheetUrl).then(res => res.text()).then(text => {

  // Makes google sheet JSON a bit more readable
  const json = JSON.parse(text.substr(47).slice(0, -2));

  // Pulls out the titles from the COL row
  let sheetKeys = {};
  for (let i = 0; i < json.table.cols.length; i++){
    sheetKeys = json.table.cols[i].label.replaceAll(' ', '').replaceAll('\n','').toLowerCase();    
    keys.push(sheetKeys);
  }

  // Slams all the information into a readable Object Array
  $.each(json.table.rows, function (index, value) {

    let obj = {};
    
    for (let row in value) {

      obj = value[row];
      arr = {};

      for (let i = 0; i < obj.length; i++){
        if(obj[i] === null) {
          obj[i] = {v: ""}; 
        }if(obj[i].v === null) {
          obj[i].v = ""; 
        }if(obj[i].f) {
          delete obj[i].v; 
          arr[keys[i]] = obj[i].f;
        }else {          
          arr[keys[i]] = obj[i].v;  
        }       

        values.push(obj);
      } 
      
      bigArr.push(arr);

    }   

  })

  for (let i = 0; i < bigArr.length; i++) {

    // Adds link into the object
    bigArr[i].link = vanillaURL + "?id=" + bigArr[i]["id"];

    // Adds TBA to items with no owners
    if(bigArr[i].owner === "") {bigArr[i].owner = "TBA";}

  }

  console.log(bigArr);

  // Checks if the page is trying to direct to a card
  if (pageURL.includes('?id=')) {
    
    // Grabs the values you need for the card
    // So you don't have to put them in manually
    let itemArray = Object.keys(bigArr[0]);
    // Replaces the 'image' in the array with something
    // that'll actually make it an image
    itemArray[1] = { name: 'image', attr: 'src' };

    // List.js options for the item
    let itemOptions = {
      valueNames: itemArray,
      item: 'charadex-card',
    };

    // Create List
    let charadexItem = new List('charadex-entry', itemOptions, bigArr);

    // Searches for the correct item to display
    charadexItem.search(designID, ['id']);

    // Hides the big gallery and the search
    $('#charadex-gallery').hide();

    
  }else{

    // Hides the single entry & shows the search
    $('#charadex-entry').hide();
    $('#search').show();

    // List.js Options
    let galleryOptions = {
      valueNames: [
        'id',
        'owner',
        'artist',
        'designer',
        { name: 'image', attr: 'src' },
        { name: 'link', attr: 'href' }
      ],
      searchColumns: [
        'id',
        'owner',
        'artist',
        'designer'
      ],
      item: 'charadex-item',
      page: numOfItems,
      pagination: [{
        innerWindow: 1,
        left: 1,
        right: 1,
        paginationClass: 'pagination-top',
      },{
        innerWindow: 1,
        left: 1,
        right: 1,
        paginationClass: 'pagination-bottom',
      }],
    };

    // Create List
    let charadex = new List('charadex-gallery', galleryOptions, bigArr);
    charadex.sort('id',{order: order });

    // Force search to work outside list
    $('#search').on('keyup', function() {
      let searchString = $(this).val();
      charadex.search(searchString);
    });

    // Style pagination list items
    const bsStyle = () =>{
      $('.pagination > li').addClass('page-item');
      $('.pagination > li > a').addClass('page-link');
    }
    
    // Add prev & next
    const navButtons = () =>{
      $('.pagination').append('<li class="btn-next page-item"><a class="page-link"><i class="bi bi-chevron-right"></i></a></li>');
      $('.pagination').prepend('<li class="btn-prev page-item"><a class="page-link"><i class="bi bi-chevron-left"></i></a></li>');
      $('.btn-next').on('click', function(){$('.pagination .active').next().trigger('click');})
      $('.btn-prev').on('click', function(){$('.pagination .active').prev().trigger('click');})
    }
    
    // Calling Functions
    bsStyle();
    navButtons();

    // Shortcut function
    const forceStyle = () =>{
      bsStyle();
      if (!document.querySelector(".btn-next")){
        navButtons();
      }
    }

    // Force style on document changes
    $('.pagination').on('click', function(){forceStyle();});
    $(document.body).on('change keyup', '#search', function(event) {forceStyle();});

  }

});