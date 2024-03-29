/* ==================================================================== */
/* Clean Sheet Data
======================================================================= */
const scrubData = (sheetData) => {

    cleanJson = JSON.parse(sheetData.substring(47).slice(0, -2));

    const col = [];
    if (cleanJson.table.cols[0].label) {
        cleanJson.table.cols.forEach((headers) => {
            if (headers.label) {
                col.push(headers.label.toLowerCase().replace(/\s/g, ""));
            }
        });
    }


    // Scrubs columns and puts them in a readable object
    const scrubbedData = [];
    cleanJson.table.rows.forEach((info, num) => {
        const row = {};
        const isBoolean = val => 'boolean' === typeof val;
        col.forEach((ele, ind) => {
            row[ele] = info.c[ind] != null ?  info.c[ind].f != null && !isBoolean(info.c[ind].v) ? info.c[ind].f : info.c[ind].v != null ? info.c[ind].v : "" : "";
        });
        row["orderID"] = num + 1;
        scrubbedData.push(row);
    });


    // Removes any items that are supposed ot be hidden
    const publicData = [];
    scrubbedData.forEach((k, v) => {
        if(!scrubbedData[v]['hide']) {
            publicData.push(scrubbedData[v]);
        };
    });

    return publicData;

}


/* ================================================================ */
/* Prev/Next in Pagination
/* ================================================================ */
let charadexPrevNext = () => {
    $('.btn-next').on('click', () => { $('.pagination .active').next().children('a')[0].click(); })
    $('.btn-prev').on('click', () => { $('.pagination .active').prev().children('a')[0].click(); })
}



/* ================================================================ */
/* Search Filter
/* ================================================================ */
let charadexSearch = (info) => {
    $("#search-filter").on('change', () => {
        let selection = [$("#search-filter option:selected").text().toLowerCase()];
        if (selection && !selection.includes('all')) {
            $('#search').on('keyup', () => {
                let searchString = $('#search').val();
                info.search(searchString, selection);
            });
        };
    });
};

/* ================================================================ */
/* Custom Filter
/* ================================================================ */
let charadexFilter = (info) => {
    $("#filter").on('change', () => {
        let selection = $("#filter option:selected").text().toLowerCase();
        let filterType = $("#filter").attr('filter');
        if (selection && !selection.includes('all')) {
            info.filter(function (i) { return i.values()[filterType].toLowerCase() == selection; });
        } else {
            info.filter();
        }
    });
};


/* ================================================================ */
/* Function for Single Card
/* ================================================================ */
let charadexListFunctions = (dex) => {
    charadexFilter(dex);
    charadexSearch(dex);
    charadexPrevNext();
}


/* ==================================================================== */
/* Charadex
======================================================================= */
const charadexComplex = async (options) => {


    /* ==================================================================== */
    /* Options & URL
    ======================================================================= */
    let userOptions = options || {};
    let url = new URL(window.location.href);
    let baseURL = window.location.origin + window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);


    /* ==================================================================== */
    /* Sifting Through Options
    ======================================================================= */
    const charadexInfo = {
        sheetID: userOptions.sheetID ? userOptions.sheetID.includes('/d/') ? userOptions.sheetID.split('/d/')[1].split('/edit')[0] : userOptions.sheetID : "1l_F95Zhyj5OPQ0zs-54pqacO6bVDiH4rlh16VhPNFUc",
        sheetPage: userOptions.sheetPage ? userOptions.sheetPage : "Public Masterlist",
        itemAmount: userOptions.itemAmount ? userOptions.itemAmount : 12,
        itemOrder: userOptions.itemOrder ? userOptions.itemOrder : "desc",
        searchParams: userOptions.searchParams ? userOptions.searchParams : ['id', 'owner', 'artist', 'designer'],
        singleItemParamKey: userOptions.singleItemParamKey ? userOptions.singleItemParamKey : "id",
        singleItemParamVal: userOptions.singleItemParamVal ? userOptions.singleItemParamVal : "id",
        urlFilterParam: userOptions.urlFilterParam ? userOptions.urlFilterParam.toLowerCase().replace(/\s/g, '') : false,
    };


    /* ==================================================================== */
    /* Fetching the Sheet
    ======================================================================= */
    fetch(`https://docs.google.com/spreadsheets/d/${charadexInfo.sheetID}/gviz/tq?tqx=out:json&headers=1&tq=WHERE A IS NOT NULL&sheet=${charadexInfo.sheetPage}`)
    .then(i => i.text())
    .then(JSON => {

        $('#loading').hide();
        $('.masterlist-container').addClass('softload');

        /* ================================================================ */
        /* And so it begins
        /* ================================================================ */
        let sheetArray = scrubData(JSON); // Clean up sheet data so we can use it
        let preParam = url.search.includes(charadexInfo.urlFilterParam) ? `&${charadexInfo.singleItemParamVal}=` : `?${charadexInfo.singleItemParamVal}=`; // Determines which is used in a link


        /* ================================================================ */
        /* URL Param Buttons
        /* ================================================================ */
        (() => {

            if (sheetArray[0].hasOwnProperty(charadexInfo.urlFilterParam)) {

                $('#filter-buttons').show();

                // Creates Param Object Array
                let urlParamArray = [];
                const uniqueArray = [...new Set(sheetArray.map(i => i[charadexInfo.urlFilterParam]))];
                uniqueArray.forEach((i) => {
                    urlParamArray.push({
                        title: i,
                        link: url.href.split('&')[0].split('?')[0] + '?' + charadexInfo.urlFilterParam + '=' + i.toLowerCase(),
                    });
                });

                // Adds All Button
                urlParamArray.unshift({ title: 'All', link: url.href.split('&')[0].split('?')[0] });

                // Sorts list
                urlParamArray.sort((a, b) => { return a.title - b.title });

                // List.js options
                let buttonOptions = {
                    valueNames: ['title', { name: 'link', attr: 'href' }],
                    item: 'charadex-filter-buttons',
                };

                // Creates singular item
                let urlParamButtons = new List("filter-buttons", buttonOptions, urlParamArray);

            }

        })();

        /* ================================================================ */
        /* Modifying Array
        /* ================================================================ */
        (() => {

            // Adding link to card
            for (var i in sheetArray){
                sheetArray[i].cardlink = baseURL + preParam + sheetArray[i][charadexInfo.singleItemParamVal];
            }

            // Filters out information based on URL parameters
            if (urlParams.has(charadexInfo.urlFilterParam) && charadexInfo.urlFilterParam) { 
                sheetArray = sheetArray.filter((i) => i[charadexInfo.urlFilterParam].toLowerCase() === urlParams.get(charadexInfo.urlFilterParam).toLowerCase()); 
            }

        })();


        /* ================================================================ */
        /* Get Keys
        /* (Allows list.js to call info from sheet)
        /* ================================================================ */
        let sheetArrayKeys = () => {

            // Grab all keys from a single entry to create
            // an array
            let itemArray = Object.keys(sheetArray[0]);

            // Find the index of the cardlink and change
            // it to something list.js can render
            itemArray[itemArray.indexOf('cardlink')] = { name: 'cardlink', attr: 'href' };

            // Same for images
            itemArray[itemArray.indexOf('image')] = { name: 'image', attr: 'src' };

            return itemArray;

        };


        if (urlParams.has(charadexInfo.singleItemParamKey)) {

            /* ================================================================ */
            /* Prev & Next for Single Card
            /* ================================================================ */
            (() => {

                for (let i = 0; i < sheetArray.length; i++){
                    if (sheetArray[i].orderID == urlParams.get(charadexInfo.singleItemParamKey).replace(/\D+/gm, "")) {

                        // Prev
                        if (sheetArray[i - 1]) {
                            $("#entryPrev").attr("href", baseURL + preParam + sheetArray[i - 1][charadexInfo.singleItemParamVal]);
                            $("#entryPrev span").text(sheetArray[i - 1][charadexInfo.singleItemParamVal]);
                        } else {
                            $("#entryPrev i").remove();
                        }

                        // Next
                        if (sheetArray[i + 1]) {
                            $("#entryNext").attr("href", baseURL + preParam + sheetArray[i + 1][charadexInfo.singleItemParamVal]);
                            $("#entryNext span").text(sheetArray[i + 1][charadexInfo.singleItemParamVal]);
                        } else {
                            $("#entryNext i").remove();
                        }

                    }
                }

                // Back to masterlist (keeps species parameter)
                $("#masterlistLink").attr("href", baseURL);

            })();

            /* ================================================================ */
            /* Charadex Single Card
            /* ================================================================ */
            (() => {

                // List.js options
                let itemOptions = {
                    valueNames: sheetArrayKeys(),
                    item: 'charadex-card',
                };

                // Filtering out singular card
                let pageIDVal = urlParams.get(charadexInfo.singleItemParamVal);
                sheetArray = sheetArray.filter((i) => i[charadexInfo.singleItemParamKey].includes(pageIDVal))[0];

                // Creates singular item
                let charadexItem = new List("charadex-gallery", itemOptions, sheetArray);

            })();

        } else {

            /* ================================================================ */
            /* Charadex Gallery
            /* ================================================================ */
            $('#charadex-filters').show();

            (() => {

                let galleryOptions = {
                    item: 'charadex-entries',
                    valueNames: sheetArrayKeys(),
                    searchColumns: charadexInfo.searchParams,
                    page: charadexInfo.itemAmount,
                    pagination: [{
                        innerWindow: 1,
                        left: 1,
                        right: 1,
                        item: `<li class='page-item'><a class='page page-link'></a></li>`,
                        paginationClass: 'pagination-top',
                    }],
                };

                let charadex = new List('charadex-gallery', galleryOptions, sheetArray);

                // Sort based on ID
                charadex.sort("orderID", { order: charadexInfo.itemOrder, })

                // Calling all functions here
                charadexListFunctions(charadex);

            })();

        }

    })
};


/* ==================================================================== */
/* Charadex Simple
/* This is used for smaller pages like traits and catalogue
======================================================================= */
const charadexSimple = async (options) => {


    /* ==================================================================== */
    /* Options & URL
    ======================================================================= */
    let userOptions = options || {};


    /* ==================================================================== */
    /* Sifting Through Options
    ======================================================================= */
    const charadexInfo = {
        sheetID: userOptions.sheetID ? userOptions.sheetID.includes('/d/') ? userOptions.sheetID.split('/d/')[1].split('/edit')[0] : userOptions.sheetID : "1l_F95Zhyj5OPQ0zs-54pqacO6bVDiH4rlh16VhPNFUc",
        sheetPage: userOptions.sheetPage ? userOptions.sheetPage : "Public Masterlist",
        itemOrder: userOptions.itemOrder ? userOptions.itemOrder : "desc",
        categorizeBy: userOptions.categorizeBy ? userOptions.categorizeBy : "rarity",
        searchParams: userOptions.searchParams ? userOptions.searchParams : ['item', 'trait'],
    };


    /* ==================================================================== */
    /* Fetching the Sheet
    ======================================================================= */
    fetch(`https://docs.google.com/spreadsheets/d/${charadexInfo.sheetID}/gviz/tq?tqx=out:json&headers=1&tq=WHERE A IS NOT NULL&sheet=${charadexInfo.sheetPage}`).then(i => i.text()).then(JSON => {

        $('#loading').hide();
        $('.masterlist-container').addClass('softload');

        /* ================================================================ */
        /* And so it begins
        /* ================================================================ */
        let sheetArray = scrubData(JSON); // Clean up sheet data so we can use it


        /* ================================================================ */
        /* Get Keys
        /* (Allows list.js to call info from sheet)
        /* ================================================================ */
        let sheetArrayKeys = () => {

            // Grab all keys from a single entry to create an array
            let itemArray = Object.keys(sheetArray[0]);

            // Same for images
            itemArray[itemArray.indexOf('image')] = { name: 'image', attr: 'src' };

            return itemArray;

        };


        /* ================================================================ */
        /* Charadex Gallery
        /* ================================================================ */
        $('#charadex-filters').show();

        (() => {

            let galleryOptions = {
                item: 'charadex-entries',
                valueNames: sheetArrayKeys(),
            };

            let charadex = new List('charadex-gallery', galleryOptions, sheetArray);

            // Sort based on ID
            charadex.sort(charadexInfo.categorizeBy, {order: charadexInfo.categorizeBy})

            // Calling all functions here
            charadexListFunctions(charadex);

        })();


    })

};
