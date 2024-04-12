var url = "https://spreadsheets.google.com/feeds/list/" + sheetID + "/" + sheetPage + "/public/values?alt=json";
var perPage = 24;
var currentPage = 1;
var values = [];

$.getJSON(url, function(data) {
  var output = "";
  $.each(data.feed.entry, function(index,value) {
    values.push({
      id:          value.gsx$id.$t, 
      image:       value.gsx$image.$t, 
      owner:       value.gsx$owner.$t, 
      artist:      value.gsx$artist.$t, 
      designer:    value.gsx$designer.$t, 
      worth:       value.gsx$worth.$t, 
      status:      value.gsx$status.$t, 
      cooldown:    value.gsx$cooldown.$t,
      designtype:  value.gsx$designtype.$t,
      notes:       value.gsx$notes.$t,
    });
    if (index < perPage) {
      output += `
        <div class="col">
          <div class="card h-100 overflow-hidden" style="max-width: 540px;">
            <h5 class="card-header d-flex justify-content-between">
              ` + value.gsx$id.$t + ` 
              <a class="text-reset" type="button" data-bs-toggle="collapse" data-bs-target=".` + value.gsx$id.$t + `">
                <i class="bi bi-info-circle-fill"></i>
              </a>
            </h5>
            <div class="collapse show ` + value.gsx$id.$t + `">
              <div style="
              
                height: 300px;
                background-image: url(` + value.gsx$image.$t + `);
                background-size: contain;
                background-position: center;
                background-repeat: no-repeat;">
                
              </div>
            </div>
            <div class="collapse ` + value.gsx$id.$t + `">
              <div class="overflow-auto" style="height:300px;">
                <ul class="list-group list-group-flush" style="font-size:80%">

                  <li class="list-group-item d-flex justify-content-between">
                    <b>Owner</b>` + value.gsx$owner.$t + `
                  </li>
                  
                  <li class="list-group-item d-flex justify-content-between">
                    <b>Artist</b>` + value.gsx$artist.$t + `
                  </li>
                  
                  <li class="list-group-item d-flex justify-content-between">
                    <b>Designer</b>` + value.gsx$designer.$t + `
                  </li>
                  
                  <li class="list-group-item d-flex justify-content-between">
                    <b>Worth</b>` + value.gsx$worth.$t + `
                  </li>
                  
                  <li class="list-group-item d-flex justify-content-between">
                    <b>Status</b>` + value.gsx$status.$t + `
                  </li>
                  
                  <li class="list-group-item d-flex justify-content-between">
                    <b>Cooldown</b>` + value.gsx$cooldown.$t + `
                  </li>
                  
                  <li class="list-group-item d-flex justify-content-between">
                    <b>Design Type</b>` + value.gsx$designtype.$t + `
                  </li>
                  
                  <li class="list-group-item">
                    <b>Notes</b>
                    <div class="ps-2">` + value.gsx$notes.$t + `</div>
                  </li>

                </ul>
              </div>  
            </div>
          </div>
        </div>
      `;
    }
  });
  $(".masterlist-entries").append(output);
});

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

function changePage() {
  $(".masterlist-entries").html("");
  var start = (currentPage - 1) * perPage;
  var output = values.slice(start, start + perPage).reduce((s, e) => {
    return s += `
        <div class="col">
          <div class="card h-100 overflow-hidden" style="max-width: 540px;">
            <h5 class="card-header d-flex justify-content-between">
              ` + e.id + ` 
              <a class="text-reset" type="button" data-bs-toggle="collapse" data-bs-target=".` + e.id + `">
                <i class="bi bi-info-circle-fill"></i>
              </a>
            </h5>
            <div class="collapse show ` + e.id + `">
              <div style="
              
                height: 300px;
                background-image: url(` + e.image + `);
                background-size: contain;
                background-position: center;
                background-repeat: no-repeat;">
                
              </div>
            </div>
            <div class="collapse ` + e.id + `">
              <div class="overflow-auto" style="height:300px;">
                <ul class="list-group list-group-flush" style="font-size:80%">

                  <li class="list-group-item d-flex justify-content-between">
                    <b>Owner</b>` + e.owner + `
                  </li>
                  
                  <li class="list-group-item d-flex justify-content-between">
                    <b>Artist</b>` + e.artist + `
                  </li>
                  
                  <li class="list-group-item d-flex justify-content-between">
                    <b>Designer</b>` + e.designer + `
                  </li>
                  
                  <li class="list-group-item d-flex justify-content-between">
                    <b>Worth</b>` + e.worth + `
                  </li>
                  
                  <li class="list-group-item d-flex justify-content-between">
                    <b>Status</b>` + e.status + `
                  </li>
                  
                  <li class="list-group-item d-flex justify-content-between">
                    <b>Cooldown</b>` + e.cooldown + `
                  </li>
                  
                  <li class="list-group-item d-flex justify-content-between">
                    <b>Design Type</b>` + e.designtype + `
                  </li>
                  
                  <li class="list-group-item">
                    <b>Notes</b>
                    <div class="ps-2">` + e.notes + `</div>
                  </li>

                </ul>
              </div>  
            </div>
          </div>
        </div>
      `;    
  }, "");
  $(".masterlist-entries").append(output);
}

function numPages() {
  return Math.ceil(values.length / perPage);
}