> [!WARNING]  
> This feature hasn't been extensively tested and might have bugs! Use at your own risk.

&nbsp;

# Charadex v1.5.5 / Features / Image Gallery

This will add a **very basic** image gallery to your Charadex Site. It's only going to allow you to add one artist and there's no content warning feature. It will only add a gallery.html page and a gallery section to the masterlist.

If you're upgrading from an older version of the site, you can use this right out of the box. If you've already upgraded and just want to add this feature to your current v1.5.5 site, please follow the guide below.

Note that you might have to edit some variables if you've edited config/page names.

&nbsp;

&nbsp;

## General Steps

### Step 1

Open [this sheet](https://docs.google.com/spreadsheets/d/1vcUJX7MODFgdtY5BEYkMhAh0u_e7ea9yXQdCjRDhaI8/edit?gid=1485004280#gid=1485004280) and find the `Image Gallery` tab. Right click the tab and select `Copy to` then `Existing Spreadsheet`. Select your your current Masterlist spreadsheet.

Note: You'll need to add your own Data Validation to this sheet - you can google that or [follow my very bare bones guide](https://github.com/charadex-team/charadex-v1.0/wiki/Google-Sheet-Tips#creating-new-dropdowns).

&nbsp;

### Step 2

File Links: [config.js](https://github.com/charadex-team/charadex-v1.0/blob/v1.5.5/features/image-gallery/styles/js/config.js)

Find your `config.js` file, we'll be making several edits.

Add the following snippet to the other pages:
```
  imageGallery:  "image gallery",
```

Then add the following anywhere **before** the `charadex.pages.masterlist` config:
```
/* Image Gallery
/* --------------------------------------------------------------- */
charadex.page.imageGallery = {

  sheetPage: charadex.sheet.pages.imageGallery,
  sitePage: 'gallery',
  dexSelector: 'charadex',
  profileProperty: 'id',

  sort: {
    toggle: true,
    key: "id",
    order: "asc",
    parameters: []
  },

  pagination: {
    toggle: true,
    bottomToggle: true,
    amount: 12,
  },

  filters: {
    toggle: false,
    parameters: {}
  },

  fauxFolder: {
    toggle: false,
    folderProperty: '',
    parameters: [],
  },

  search: {
    toggle: true,
    filterToggle: true,
    parameters: ['All', 'Designs', 'Artist']
  },

  prevNext: {
    toggle: false,
  },

};
```

Finally, find the `charadex.pages.masterlist` config and add the following inside `relatedData`:

```
  [charadex.sheet.pages.imageGallery]: {

    ... charadex.page.imageGallery,

    sheetPage: charadex.sheet.pages.imageGallery,
    primaryProperty: 'design',
    relatedProperty: 'designs',
    dexSelector: 'gallery',
    profileProperty: 'id',
    profileToggle: false,

    sort: {
      toggle: true,
      key: "id",
      order: "asc",
      parameters: []
    },

    pagination: {
      toggle: true,
      bottomToggle: true,
      amount: 12,
    },

  }
```

&nbsp;

### Step 2.5 | Update relateData function

File Links: [utilities.js](https://github.com/charadex-team/charadex-v1.0/blob/v1.5.5/features/image-gallery/styles/js/utilities.js)

If you aren't using the most up to date version of v1.5.5, make sure to go to the `utilities.js` file and find the `relateData` function in `charadex.manageData`. Completely overwrite it with the following: 

```JS
/* Relates data to a main sheet via a key
  ===================================================================== */
  async relateData (primaryArray, primaryKey, secondaryPageName, secondaryKey) {

    let scrub = charadex.tools.scrub;
    let secondaryArray = await charadex.importSheet(secondaryPageName);

    for (let primaryEntry of primaryArray) {
      primaryEntry[scrub(secondaryPageName)] = [];
      for (let secondaryEntry of secondaryArray) {
        let secondaryDataArray = secondaryEntry[secondaryKey].split(',');
        for (let prop of secondaryDataArray) {
          if (scrub(primaryEntry[primaryKey]) === scrub(prop)) {
            primaryEntry[scrub(secondaryPageName)].push(secondaryEntry);
          }
        }
      }
    }

  },
```

&nbsp;

### Step 3 | Add Gallery Files

File Links: [gallery.html](https://github.com/charadex-team/charadex-v1.0/blob/v1.5.5/features/image-gallery/gallery.html), [gallery.js](https://github.com/charadex-team/charadex-v1.0/blob/v1.5.5/features/image-gallery/styles/js/pages/gallery.js)

Add the `gallery.js` file to `styles/js/pages` folder, then add the `gallery.html` file to the main folder. Make sure to update the meta data in the HTML file. 

&nbsp;

### Step 4 | Add to Masterlist

File Links: [masterlist.html](https://github.com/charadex-team/charadex-v1.0/blob/v1.5.5/features/image-gallery/masterlist.html), [masterlist.js](https://github.com/charadex-team/charadex-v1.0/blob/v1.5.5/features/image-gallery/styles/js/pages/masterlist.js)

Find your `masterlist.js` file in the `styles/js/pages` folder and add the following snippet **within** the `if (listData.type == 'profile')` brackets:

```JS
  // Create the image gallery
  if (charadex.tools.checkArray(listData.profileArray[0].imagegallery)) {
    let gallery = await charadex.initialize.page(
      listData.profileArray[0].imagegallery,
      charadex.page.masterlist.relatedData['image gallery']
    );
  }
```

Then find your `masterlist.html` file and add the following to the **Nav Tabs** portion of the gallery profile.

```HTML
  <li class="col p-1 nav-item" role="presentation">
    <a class="w-100 btn btn-primary" id="image-gallery-tab" data-toggle="tab" href="#image-gallery" 
    aria-controls="image-gallery" aria-selected="true">Gallery</a>
  </li>
```

Finally add this snippet _after_ the **Main Profile** tab pane.

```HTML
  <!-- Image Gallery
  <!-- ----------------------------------------------------------- -->
  <div class="tab-pane fade" id="image-gallery" role="tabpanel" aria-labelledby="image-gallery-tab" tabindex="0">
    <h4 class="text-primary">Gallery</h4>
    <div id="gallery-gallery">

      <!-- Pagination
      <!-- --------------------------------------------------------------- -->
      <div style="display: none;" class="gallery-pagination-container">
        <hr>
        <div class="nav d-flex justify-content-center my-n2">
          <div class="btn-prev page-item"><a class="page-link"><i class="fa fa-chevron-left"></i></a></div>
          <ul class="pagination gallery-pagination gallery-pagination-top justify-content-center m-0"></ul>
          <div class="btn-next page-item"><a class="page-link"><i class="fa fa-chevron-right"></i></a></div>
        </div>
        <hr>
      </div>

      <!-- List -->
      <!-- --------------------------------------------------------------- -->
      <div class="row no-gutters m-n2 gallery-list"></div>

      <!-- List Item -->
      <!-- --------------------------------------------------------------- -->
      <div style="display: none;">
        <div class="col-md-4 p-2" id="gallery-gallery-item">
          <div class="card bg-faded">

            <!-- Image-->
            <a class="card-body cd-gallery-card p-2 d-flex flex-fill profilelink" href="">
              <img class="image img-fluid m-auto rounded" src="" >
            </a>

            <!-- Artist -->
            <div class="card-footer bg-faded text-right px-3 py-1 small">
              Artist: <a class="artist artistlink"></a>
            </div>

          </div>
        </div>
      </div>

      <!-- Pagination
      <!-- --------------------------------------------------------------- -->
      <div style="display: none;" class="gallery-pagination-container">
        <hr>
        <div class="nav d-flex justify-content-center my-n2">
          <div class="btn-prev page-item"><a class="page-link"><i class="fa fa-chevron-left"></i></a></div>
          <ul class="pagination gallery-pagination gallery-pagination-bottom justify-content-center m-0"></ul>
          <div class="btn-next page-item"><a class="page-link"><i class="fa fa-chevron-right"></i></a></div>
        </div>
      </div>

    </div>
  </div>
```

After that, you should be able to tag multiple characters in a gallery image and it'll show up in their profile!
