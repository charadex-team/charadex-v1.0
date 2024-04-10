/* ------------------------------------------------------------------- */
/* Sheet ID
/* Your sheet ID
/* ------------------------------------------------------------------- */
let sheetID = "1GwgfLizD3HQCieGia6di-TfU4E3EipT9Jb0BDZQwNak";


/* ------------------------------------------------------------------- */
/* All sheet pages
/* ------------------------------------------------------------------- */
let sheetPages = {

    masterlist: "masterlist",
    inventories: "inventory",
    items: "items",
    traits: "traits",
    prompts: "prompts",
    faq: "faq",
    staff: "mods",

}


/* ------------------------------------------------------------------- */
/* All Site Options
/* ------------------------------------------------------------------- */
let options = {


    /* Index
    /* --------------------------------------------------------------- */
    index: {

        // Sheet Information
        masterlistSheetPage: sheetPages.masterlist,
        staffSheetPage: sheetPages.staff,
        promptSheetPage: sheetPages.prompts,
    
    },


    /* Masterlist
    /* --------------------------------------------------------------- */
    masterlist: {

        sheetPage: sheetPages.masterlist,

        // Amount of items shown on the page. Default is 12.
        itemAmount: 12,

        // Ascending  (1 2 3) || asc
        // Descending (3 2 1) || desc
        itemOrder: "asc",

        // For the single column filter
        filterColumn: 'Design Type',

        // Columns you'd like people to be able to search though
        searchFilterParams: ['ID', 'Owner', 'Designer', 'Artist'],

        // Column to create faux folder links from
        fauxFolderColumn: 'Species',

    },


    /* Item Catalogue
    /* --------------------------------------------------------------- */
    items: {

        // Sheet Information
        sheetPage: sheetPages.items,
    
        // Amount of items shown on the page. Default is 12.
        itemAmount: 24,
    
        // Ascending  (1 2 3) || asc
        // Descending (3 2 1) || desc
        itemOrder: "asc",
    
        // For the single column filter
        filterColumn: 'Rarity',
    
        // Columns you'd like people to be able to search though
        searchFilterParams: ['Item'],
    
        // Column to create faux folder links from
        fauxFolderColumn: 'Type',
    
    },


    /* Invetory
    /* --------------------------------------------------------------- */
    inventory: {

        // Sheet Information
        sheetPage: sheetPages.inventories,
        itemSheetPage: sheetPages.items,
    
        // Amount of items shown on the page. Default is 12.
        itemAmount: 24,
    
        // Info you'd like people to be able to search though
        searchFilterParams: ['Username'],
    
    },


    /* Prompts
    /* --------------------------------------------------------------- */
    prompts: {
    
        // Sheet Information
        sheetPage: sheetPages.prompts,
    
        // Amount of items shown on the page. Default is 12.
        itemAmount: 24,
    
        // Ascending  (1 2 3) || asc
        // Descending (3 2 1) || desc
        itemOrder: "desc",
    
        // Columns you'd like people to be able to search though
        searchFilterParams: ['Title'],
    
    },


    /* Traits
    /* --------------------------------------------------------------- */
    traits: {
    
        // Sheet Information
        sheetPage: sheetPages.traits,
    
        // Amount of items shown on the page. Default is 12.
        itemAmount: 24,
    
        // Ascending  (1 2 3) || asc
        // Descending (3 2 1) || desc
        itemOrder: "asc",
    
        // For the single column filter
        filterColumn: 'Rarity',
    
        // Columns you'd like people to be able to search though
        searchFilterParams: ['Trait'],
    
        // Column to create faux folder links from
        fauxFolderColumn: 'Type',
    
    },


    /* Staff
    /* --------------------------------------------------------------- */
    staff: {
    
        // Sheet Information
        sheetPage: sheetPages.staff,
    
    },


    /* FAQ
    /* --------------------------------------------------------------- */
    faq: {
    
        // Sheet Information
        sheetPage: sheetPages.faq,
    
        // Amount of items shown on the page. Default is 12.
        itemAmount: 24,
    
        // Ascending  (1 2 3) || asc
        // Descending (3 2 1) || desc
        itemOrder: "asc",
    
        // Columns you'd like people to be able to search though
        searchFilterParams: ['Tags'],
    
    },


}