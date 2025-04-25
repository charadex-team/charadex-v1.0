/* ==================================================================== */
/* Charadex
=======================================================================  /

  You can use this method to grab these URLs at any time
    
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
charadex.page = {};


/* Item Catalogue
/* --------------------------------------------------------------- */
charadex.page.items = {

  sheetPage: charadex.sheet.pages.items,
  sitePage: 'items',
  dexSelector: 'charadex',
  profileKey: 'item',

  sort: {
    toggle: true,
    key: "id",
    order: "asc",
    parameters: []
  },

  pagination: {
    toggle: true,
    bottomToggle: true,
    amount: 24,
  },

  filters: {
    toggle: true,
    parameters: {
      'Type': ['All', 'Currency', 'MYO Ticket', 'Breeding', 'Trait Potion', 'Corruption Potion','Mutation Item', 'Miscellaneous'],
      'Rarity': ['All', 'Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary'],
    }
  },

  fauxFolder: {
    toggle: true,
    dataKey: 'Type',
    parameters: ['All', 'Currency', 'MYO Ticket', 'Breeding', 'Trait Potion', 'Corruption Potion','Mutation Item', 'Miscellaneous'],
  },

  search: {
    toggle: true,
    filterToggle: true,
    parameters: ['All', 'Item', 'Rarity']
  },

  prevNext: {
    toggle: true,
  },

};


/* Traits
/* --------------------------------------------------------------- */
charadex.page.traits = {

  sheetPage: charadex.sheet.pages.traits,
  sitePage: 'traits',
  dexSelector: 'charadex',
  profileKey: 'trait',

  sort: {
    toggle: true,
    key: "id",
    order: "asc",
    parameters: []
  },

  pagination: {
    toggle: true,
    bottomToggle: true,
    amount: 24,
  },

  filters: {
    toggle: true,
    parameters: {
      'Type': ['All'],
      'Rarity': ['All', 'Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary'],
    }
  },

  fauxFolder: {
    toggle: true,
    dataKey: 'Type',
    parameters: ['All'],
  },

  search: {
    toggle: true,
    filterToggle: true,
    parameters: ['All', 'Trait', 'Rarity']
  },

  prevNext: {
    toggle: true,
  },

};


/* Prompts
/* --------------------------------------------------------------- */
charadex.page.prompts = {

  sheetPage: charadex.sheet.pages.prompts,
  profileKey: 'prompt',

  itemAmount: 24,
  itemOrder: "desc",

  searchFilterParams: ['Title'],

};


/* Staff
/* --------------------------------------------------------------- */
charadex.page.staff = {

  sheetPage: charadex.sheet.pages.staff,
  profileKey: 'username',

};


/* FAQ
/* --------------------------------------------------------------- */
charadex.page.faq = {

  sheetPage: charadex.sheet.pages.faq,
  profileKey: 'id',

  itemAmount: 24,
  itemOrder: "asc",

  searchFilterParams: ['All', 'Tags'],

}



/* Masterlist
/* --------------------------------------------------------------- */
charadex.page.masterlist = {

  sheetPage: charadex.sheet.pages.masterlist,
  sitePage: 'masterlist',
  dexSelector: 'charadex',
  profileKey: 'design',

  sort: {
    toggle: true,
    key: "id",
    order: "desc",
    parameters: []
  },

  pagination: {
    toggle: true,
    bottomToggle: true,
    amount: 12,
  },

  filters: {
    toggle: true,
    parameters: {
      'Design Type': ['All', 'Official Design', 'MYO Design'],
      'Status': ['All', 'Can Sell', 'Can Trade'],
      'Rarity': ['All', 'Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary'],
    }
  },

  fauxFolder: {
    toggle: true,
    dataKey: 'Species',
    parameters: ['All', 'Dog', 'Cat'],
  },

  search: {
    toggle: true,
    filterToggle: true,
    parameters: ['All', 'ID', 'Owner', 'Designer', 'Artist']
  },

  prevNext: {
    toggle: true,
  },

  relatedData: {

    [charadex.sheet.pages.masterlistLog]: {

      sheetPage: charadex.sheet.pages.masterlistLog,
      primaryPageKey: 'id',
      secondaryPageKey: 'id',
      dexSelector: 'log',
      profileKey: 'design',

      sort: {
        toggle: true,
        key: "timestamp",
        order: "desc",
        parameters: []
      },

      pagination: {
        toggle: true,
        bottomToggle: false,
        amount: 12,
      },

    }

  }

};

/* Inventory
/* --------------------------------------------------------------- */
charadex.page.inventory = {

  // Dex Set Up
  sheetPage: charadex.sheet.pages.inventory,
  sitePage: 'inventories',
  dexSelector: 'charadex',
  profileKey: 'username',

  // Dex Options
  sort: {
    toggle: true,
    key: "username",
    order: "asc",
    parameters: []
  },

  pagination: {
    toggle: true,
    bottomToggle: true,
    amount: 24,
  },

  filters: {
    toggle: false,
    parameters: {}
  },

  fauxFolder: {
    toggle: false,
    dataKey: '',
    parameters: [],
  },

  search: {
    toggle: true,
    filterToggle: false,
    parameters: ['Username']
  },

  prevNext: {
    toggle: false,
  },


  // Related Data
  relatedData: {

    [charadex.sheet.pages.inventoryLog]: {

      sheetPage: charadex.sheet.pages.inventoryLog,
      sitePage: 'inventories',
      primaryPageKey: 'username',
      secondaryPageKey: 'username',
      dexSelector: 'log',
      profileKey: 'id',

      pagination: {
        toggle: true,
        bottomToggle: false,
        amount: 12,
      },

    },
    

    [charadex.sheet.pages.masterlist]: {

      sheetPage: charadex.sheet.pages.masterlist,
      sitePage: 'masterlist',
      primaryPageKey: 'username',
      secondaryPageKey: 'owner',
      dexSelector: 'designs',
      profileKey: 'design',

      pagination: {
        toggle: true,
        bottomToggle: true,
        amount: 10,
      },

      search: {
        toggle: false,
        filterToggle: false,
        parameters: ['Username']
      },

    }

  },

  
  // This is a special config for their inventory
  inventoryConfig: {

    sheetPage: charadex.sheet.pages.items,
    sitePage: 'items',
    dexSelector: 'inventory',
    profileKey: 'item',

    sort: {
      toggle: true,
      key: "item",
      order: "asc",
      parametersKey: 'type', 
      parameters: ['All', 'Currency', 'MYO Ticket', 'Breeding', 'Trait Potion', 'Corruption Potion','Mutation Item', 'Miscellaneous']
    },

    search: {
      toggle: true,
      filterToggle: false,
      parameters: ['Item']
    },

    filters: {
      toggle: true,
      parameters: {
        'Type': ['All', 'Currency', 'MYO Ticket', 'Breeding', 'Trait Potion', 'Corruption Potion','Mutation Item', 'Miscellaneous'],
        'Rarity': ['All', 'Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary'],
      }
    },

  }

};


/* Index
/* --------------------------------------------------------------- */
charadex.page.index = {

  promptSheetPage: charadex.sheet.pages.prompts,
  numOfPrompts: 3,

  staffSheetPage: charadex.sheet.pages.staff,
  numOfStaff: 8,

  masterlistSheetPage: charadex.sheet.pages.masterlist,
  numOfDesigns: 4,

};


export { charadex };