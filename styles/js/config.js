/* ==================================================================== */
/* Charadex
=======================================================================  /

  You can use this method to grab these URLs at any time

  console.log(createUrl.fullUrl);
  console.log(createUrl.addParams(createUrl.pageUrl, {'design': 'CHA0001'}));
    
======================================================================= */
let charadex = {};

/* ------------------------------------------------------------------- */
/* Sheet ID
/* Your sheet ID
/* ------------------------------------------------------------------- */
charadex.sheet = {

  id: "1MhAv9KfLfJu0aoxnJxQ4Qo6GkXaRemkGIxChcdS6Me0",

  pages: {
    masterlist:    "masterlist",
    masterlistLog: "masterlist log",
    inventory:     "inventory",
    inventoryLog:  "inventory log",
    items:         "items",
    traits:        "traits",
    prompts:       "prompts",
    faq:           "faq",
    staff:         "mods",
  }


}


/* ------------------------------------------------------------------- */
/* All Site Options
/* ------------------------------------------------------------------- */
charadex.page = {


  /* Index
  /* --------------------------------------------------------------- */
  index: {

    promptSheetPage: charadex.sheet.pages.prompts,
    numOfPrompts: 3,

    staffSheetPage: charadex.sheet.pages.staff,
    numOfStaff: 8,

    masterlistSheetPage: charadex.sheet.pages.masterlist,
    numOfDesigns: 4,

  },


  /* Masterlist
  /* --------------------------------------------------------------- */
  masterlist: {

    sheetPage: charadex.sheet.pages.masterlist,
    logSheetPage: charadex.sheet.pages.masterlistLog,
    profileKey: 'design',

    itemAmount: 12,
    itemOrder: "asc",

    filterColumn: 'Design Type',
    searchFilterParams: ['All', 'ID', 'Owner', 'Designer', 'Artist'],
    fauxFolderColumn: 'Species',

  },


  /* Item Catalogue
  /* --------------------------------------------------------------- */
  items: {

    sheetPage: charadex.sheet.pages.items,
    profileKey: 'item',

    itemAmount: 24,
    itemOrder: "asc",

    filterColumn: 'Rarity',
    searchFilterParams: ['Item'],
    fauxFolderColumn: 'Type',

  },


  /* Invetory
  /* --------------------------------------------------------------- */
  inventory: {

    sheetPage: charadex.sheet.pages.inventory,
    itemSheetPage: charadex.sheet.pages.items,
    logSheetPage: charadex.sheet.pages.inventoryLog,
    profileKey: 'username',

    itemAmount: 24,
    sortTypes: ['All', 'Currency', 'MYO Slot', 'Pet', 'Trait', 'Misc'],

    searchFilterParams: ['Username'],

  },


  /* Prompts
  /* --------------------------------------------------------------- */
  prompts: {

    sheetPage: charadex.sheet.pages.prompts,
    profileKey: 'prompt',

    itemAmount: 24,
    itemOrder: "desc",

    searchFilterParams: ['Title'],

  },


  /* Traits
  /* --------------------------------------------------------------- */
  traits: {

    sheetPage: charadex.sheet.pages.traits,
    profileKey: 'design',

    itemAmount: 24,
    itemOrder: "asc",

    filterColumn: 'trait',
    searchFilterParams: ['All', 'Trait'],
    fauxFolderColumn: 'Type',

  },


  /* Staff
  /* --------------------------------------------------------------- */
  staff: {

    sheetPage: charadex.sheet.pages.staff,
    profileKey: 'username',

  },


  /* FAQ
  /* --------------------------------------------------------------- */
  faq: {

    sheetPage: charadex.sheet.pages.faq,
    profileKey: 'id',

    itemAmount: 24,
    itemOrder: "asc",

    searchFilterParams: ['All', 'Tags'],

  },


}

export { charadex };