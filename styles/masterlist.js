// Spreadsheet object
var values = [];

// Page URL Junk
var pageURL = window.location.href;
var designID = pageURL.split('=')[1];

// Template for the character cards
var cardTemplate = function(id, image) {
  return { 
    id,
    image,
    htmlTemplate: function htmlTemplate() {
      return `
      <div class="col-xl-3 col-lg-4 col-sm-6 p-3">
        <a href="${pageURL}?entry?=${this.id}" class="card d-block h-100 overflow-hidden" style="max-width: 540px;">
          <h5 class="card-header text-center">${this.id}</h5>
					<div style="

						height: 300px;
						background-image: url(${this.image});
						background-size: contain;
						background-position: center;
						background-repeat: no-repeat;">

					</div>
        </a>
      </div>
      `
    }
  }
};

// Retrieves sheet info and parses it into an object
// Outputs first page of entries
$.getJSON(url, function (data) {
  var output = "";
  $.each(data.feed.entry, function (index, value) {
    values.push({
      id:         value.gsx$id.$t,
      image:      value.gsx$image.$t,
      owner:      value.gsx$owner.$t,
      artist:     value.gsx$artist.$t,
      designer:   value.gsx$designer.$t,
      worth:      value.gsx$worth.$t,
      status:     value.gsx$status.$t,
      cooldown:   value.gsx$cooldown.$t,
      designtype: value.gsx$designtype.$t,
      notes:      value.gsx$notes.$t
    });
    if(index < perPage && !pageURL.includes('?=')) {
      var tempItems = cardTemplate(value.gsx$id.$t, value.gsx$image.$t);
      output += tempItems.htmlTemplate();
    }
  });
  
  $(".masterlist-entries").append(output);
  
});


// Pagination functions
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    changePage();
  }
}

function nextPage() {
  if (currentPage < numPages()) {
    currentPage++;
    changePage();
  }
}

// Outputs info on the rest of the pages when you click the next/back
function changePage() {
  $(".masterlist-entries").html("");
  var start = (currentPage - 1) * perPage;
  var output = values.slice(start, start + perPage).reduce(function (s, e) {
      var paginateTempItems = cardTemplate(e.id, e.image);
      return s += paginateTempItems.htmlTemplate();
  }, "");
  $(".masterlist-entries").append(output);
}

function numPages() {
  return Math.ceil(values.length / perPage);
}

// Outputs the single card based on the URL
function singleCards() {
  if (pageURL.includes('?=')) {
    newShit = values; 
    $(".masterlist-entries").html("");
    var output = "";
    for (i = 0; i <= Object.keys(newShit).length; i++) {
    	if (i == designID.replace(/[^0-9]/g,'')) {
    		var id = i - 1;
    		output = `
    		<div class="col m-md-auto p-3" style="max-width:calc(768px - 2rem);flex: 1;">
      		<div class="card overflow-hidden">
              <h2 class="card-header text-center">
                ${newShit[id].id}
              </h2>
              <div class="row no-gutters g-0 p-3">
                <div class="col-md-5 my-auto p-3">
                  <div style="
                  
                    height: 300px;
                    background-image: url( ${newShit[id].image});
                    background-size: contain;
                    background-position: center;
                    background-repeat: no-repeat;">
                    
                  </div>
                </div>
                <div class="col-md-7 p-3">
                  <ul class="list-group list-group-flush">
  
                    <li class="list-group-item d-flex justify-content-between">
                      <b>Owner</b>` + newShit[id].owner + `
                    </li>
                    
                    <li class="list-group-item d-flex justify-content-between">
                      <b>Artist</b>` + newShit[id].artist + `
                    </li>
                    
                    <li class="list-group-item d-flex justify-content-between">
                      <b>Designer</b>` + newShit[id].designer + `
                    </li>
                    
                    <li class="list-group-item d-flex justify-content-between">
                      <b>Worth</b>` + newShit[id].worth + `
                    </li>
                    
                    <li class="list-group-item d-flex justify-content-between">
                      <b>Status</b>` + newShit[id].status + `
                    </li>
                    
                    <li class="list-group-item d-flex justify-content-between">
                      <b>Cooldown</b>` + newShit[id].cooldown + `
                    </li>
                    
                    <li class="list-group-item d-flex justify-content-between">
                      <b>Design Type</b>` + newShit[id].designtype + `
                    </li>
                    
                    <li class="list-group-item">
                      <b>Notes</b>
                      <div class="ps-2">` + newShit[id].notes + `</div>
                    </li>
  
                  </ul>
                </div> 
              </div>  
            </div> 
          </div>
    		`
    	}
    }
    $(".masterlist-entries").append(output).css("min-height", "calc(100vh - 200px)");
  }
}

// Removes the page-nav so nothing gets messed up if it's clicked while on a card
if (pageURL.includes('?=')) {$(".page-nav").hide();}

// Loading Junk
$(".masterlist-entries").addClass("hidden");
$("body").addClass("spinner");

function slowMode(){
  return $(".masterlist-entries").removeClass("hidden").addClass("visible"),
         $("body").removeClass('spinner');
}

// Makes sure the info is loaded before showing the user
setTimeout(singleCards, 3000); 
setTimeout(slowMode, 3500);