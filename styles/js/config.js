/* ==================================================================== */
/* Charadex
=======================================================================  /

  You can use this method to grab these URLs at any time
    
======================================================================= */
let charadex = {};

/* ==================================================================== */
/* Site
/* If you don't want to hard code your site information, you
/* can fill this out instead
/* Any preview links will still show Charadex's information
/* ==================================================================== */
charadex.site = {
  title: "Charadex",
  url: "https://charadex.com",
  description: `A tool for organizing small ARPGs and species.`
}

/* ==================================================================== */
/* Sheet Config
/* Your sheet configuration
/* ==================================================================== */
charadex.sheet = {

  id: "1GwgfLizD3HQCieGia6di-TfU4E3EipT9Jb0BDZQwNak",

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
  },

  options: {

    itemTypes: ['All', 'Currency', 'MYO Ticket', 'Trait Ticket', 'Miscellaneous'],
    rarity: ['All', 'Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary'],

  }

}


/* ==================================================================== */
/* All Site Options
/* ==================================================================== */
charadex.page = {};


/* Item Catalogue
/* --------------------------------------------------------------- */
charadex.page.items = {

  sheetPage: charadex.sheet.pages.items,
  sitePage: 'items',
  dexSelector: 'charadex',
  profileProperty: 'item',

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
      'Type': charadex.sheet.options.itemTypes,
      'Rarity': charadex.sheet.options.rarity,
    }
  },

  fauxFolder: {
    toggle: true,
    folderProperty: 'Type',
    parameters: charadex.sheet.options.itemTypes,
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
  profileProperty: 'trait',

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
      'Rarity': charadex.sheet.options.rarity,
    }
  },

  fauxFolder: {
    toggle: true,
    folderProperty: 'Type',
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
  sitePage: 'prompts',
  dexSelector: 'charadex',
  profileProperty: 'title',

  sort: {
    toggle: true,
    key: "enddate",
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
    parameters: {
      'TBA': [],
    }
  },

  fauxFolder: {
    toggle: false,
    folderProperty: '',
    parameters: [],
  },

  search: {
    toggle: true,
    filterToggle: false,
    parameters: ['Title']
  },

  prevNext: {
    toggle: true,
  },

};


/* Staff
/* --------------------------------------------------------------- */
charadex.page.staff = {

  sheetPage: charadex.sheet.pages.staff,
  sitePage: 'inventories',
  dexSelector: 'charadex',
  profileProperty: 'username',

  sort: {
    toggle: false,
    key: "username",
    order: "asc",
    parameters: []
  },

  pagination: {
    toggle: false,
    bottomToggle: false,
    amount: 12,
  },

  filters: {
    toggle: false,
    parameters: {
      'TBA': [],
    }
  },

  fauxFolder: {
    toggle: false,
    folderProperty: '',
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

};


/* FAQ
/* --------------------------------------------------------------- */
charadex.page.faq = {

  sheetPage: charadex.sheet.pages.faq,
  sitePage: 'faq',
  dexSelector: 'charadex',
  profileProperty: 'id',

  sort: {
    toggle: false,
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
    parameters: {
      'TBA': [],
    }
  },

  fauxFolder: {
    toggle: false,
    folderProperty: '',
    parameters: [],
  },

  search: {
    toggle: true,
    filterToggle: true,
    parameters: ['All', 'Question', 'Answer', 'Tags']
  },

  prevNext: {
    toggle: false,
  },

}



/* Masterlist
/* --------------------------------------------------------------- */
charadex.page.masterlist = {

  sheetPage: charadex.sheet.pages.masterlist,
  sitePage: 'masterlist',
  dexSelector: 'charadex',
  profileProperty: 'design',

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
    folderProperty: 'Species',
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
      primaryProperty: 'id',
      relatedProperty: 'id',
      dexSelector: 'log',
      profileProperty: 'design',

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
  profileProperty: 'username',

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
    folderProperty: '',
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
      primaryProperty: 'username',
      relatedProperty: 'username',
      dexSelector: 'log',
      profileProperty: 'id',

      pagination: {
        toggle: true,
        bottomToggle: false,
        amount: 12,
      },

    },
    

    [charadex.sheet.pages.masterlist]: {

      // This imports the config from the masterlist
      // So you dont have to repeat yourself
      ...charadex.page.masterlist, 

      sheetPage: charadex.sheet.pages.masterlist,
      sitePage: 'masterlist',
      primaryProperty: 'username',
      relatedProperty: 'owner',
      dexSelector: 'designs',
      profileProperty: 'design',

    }

  },

  
  // This is a special config for their inventory
  inventoryConfig: {

    sheetPage: charadex.sheet.pages.items,
    sitePage: 'items',
    dexSelector: 'inventory',
    profileProperty: 'item',

    sort: {
      toggle: true,
      sortProperty: "item",
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

  prompts: {
    ... charadex.page.prompts,
    dexSelector: 'prompt',
    amount: 3,
  },

  staff: {
    ... charadex.page.staff,
    dexSelector: 'staff',
    amount: 6,
  },

  designs: {
    ... charadex.page.masterlist,
    dexSelector: 'design',
    amount: 4,
  }

};


export { charadex };