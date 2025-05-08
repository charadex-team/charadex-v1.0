> [!WARNING]  
> This feature is still in developement! **Do not use the develop/features branch in production.**

&nbsp;

# Charadex v1.5.5 / Features / Image Gallery

This is a small feature to add a **very basic** image gallery to your Charadex Site. In it's basic form, it's only going to allow you to add one artist and it does not currently have any way of marking images NSFW. It's only made to show images on masterlist profiles and in the gallery.html - there's nothing for showing up in user profiles or on the index page. If you're interested in something bigger, it'll help to [support the project]().

You do not have to already be using v1.5.5 to upgrade to use this. It'll work right out of the box with all of the original v1.5.5 features. If you just want to add this feature to your current v1.5.5 site, please follow the guide below.

&nbsp;

&nbsp;

## General Steps

### Step 1

Open [this sheet](https://docs.google.com/spreadsheets/d/1vcUJX7MODFgdtY5BEYkMhAh0u_e7ea9yXQdCjRDhaI8/edit?gid=1485004280#gid=1485004280) and find the `Image Gallery` tab. Right click the tab and select `Copy to` then `Existing Spreadsheet`. Select your your current Masterlist spreadsheet.

&nbsp;

### Step 2

Find your `config.js` file, we'll be making several edits.

Add the following snippet to the other pages:
```JSON
  imageGallery:  "image gallery",
```

Then add the following anywhere before the `charadex.pages.masterlist` config:
```JSON
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

```JSON
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

### Step 3 | Add gallery files

Add the [`gallery.js`]() file to `styles/js/pages` folder, then add the [`gallery.html`]() file to the main folder. Make sure to update the meta data!

&nbsp;

### Step 5 | Add to Masterlist

Find your `masterlist.js` file in the `styles/js/pages` folder and add the following snippet **within** the `if (listdata == profile)` brackets.

Then find your `masterlist.html` file and add the following to the **Nav Tabs** portion of the gallery profile.

```html

```

Finally add this snippet _after_ the **Main Profile** tab pane.

```html


```

After that, you should be able to tag multiple characters in a gallery image and it'll show up in their profile!