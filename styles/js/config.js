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
        primaryPageKey: 'username',
        secondaryPageKey: 'owner',
        dexSelector: 'designs',
        profileKey: 'design',
  
        pagination: {
          toggle: true,
          bottomToggle: false,
          amount: 12,
        },
  
      }
  
    },

    
    // This is a special config for their inventory
    inventoryConfig: {

      sheetPage: charadex.sheet.pages.items,
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