/* ==================================================================== */
/* URLs
======================================================================= */

    let url = new URL(window.location.href);
    let baseURL =  window.location.origin + window.location.pathname;
    let folderURL = window.location.origin + '/' + window.location.pathname.split("/")[1];



/* ==================================================================== */
/* Load Header and Footer
======================================================================= */

    $.get(folderURL + '/includes/header.html', function (data) {$('#header').replaceWith(data);});
    $.get(folderURL + '/includes/footer.html', function (data) {$('#footer').replaceWith(data);});



/* ==================================================================== */
/* Clean Sheet Data
======================================================================= */

    const scrubData = (sheetData) => {

        cleanJson = JSON.parse(sheetData.substring(47).slice(0, -2));

        // Grab column headers
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

    let charadexSearch = (info, searchArray) => {

        let arr = searchArray.map(function(v) {
            return v.toLowerCase().replace(/\s/g, "");
        });

        $('#search').on('keyup', () => {
            let selection = $("#search-filter option:selected").val();
            let searchString = $('#search').val();
            if (selection && selection != 'all') {
                info.search(searchString, [selection]);
            } else {
                info.search(searchString, arr);
            }
        });

    };



/* ================================================================ */
/* Custom Filter
/* ================================================================ */

    let charadexFilter = (info, filterKey) => {
        $("#filter").on('change', () => {
            let selection = $("#filter option:selected").text().toLowerCase();
            if (selection && !selection.includes('all')) {
                info.filter(function (i) { return i.values()[filterKey].toLowerCase() == selection; });
            } else {
                info.filter();
            }
        });
    };



/* ================================================================ */
/* QOL Funcs
/* ================================================================ */

    let keyCreator = (key) => {
        return key.toLowerCase().replace(/\s/g, "");
    };


    let addAll = (key) => {
        key.unshift("All")
        return key;
    };

    let addOptions = (arr, filter) => {
        arr.forEach((val) => {
            let optionHTML = document.createElement('option');
            optionHTML.value = val.toLowerCase().replace(/\s/g, "");
            optionHTML.textContent = val;
            filter.append(optionHTML);
        });
    };



/* ==================================================================== */
/* Charadex
======================================================================= */
const charadexLarge = (options) => {

    /* ==================================================================== */
    /* Sifting Through Options
    ======================================================================= */
    let userOptions = options || {};
    const charadexInfo = {
        sheetID: userOptions.sheetID ? userOptions.sheetID.includes('/d/') ? userOptions.sheetID.split('/d/')[1].split('/edit')[0] : userOptions.sheetID : "1l_F95Zhyj5OPQ0zs-54pqacO6bVDiH4rlh16VhPNFUc",
        sheetPage: userOptions.sheetPage ? userOptions.sheetPage : "Public Masterlist",
        itemAmount: userOptions.itemAmount ? userOptions.itemAmount : 12,
        itemOrder: userOptions.itemOrder ? userOptions.itemOrder : "desc",
        filterCol: userOptions.filterCol ? keyCreator(userOptions.filterCol) : false,
        searchParams: userOptions.searchParams ? addAll(userOptions.searchParams) : false,
        btnFilterCol: userOptions.btnFilterCol ? keyCreator(userOptions.btnFilterCol) : false,
        singleItemParamVal: userOptions.singleItemParamVal ? userOptions.singleItemParamVal : "id",
    };

    const urlParams = new URLSearchParams(window.location.search);


    /* ==================================================================== */
    /* Fetching the Sheet
    ======================================================================= */
    fetch(`https://docs.google.com/spreadsheets/d/${charadexInfo.sheetID}/gviz/tq?tqx=out:json&headers=1&tq=WHERE A IS NOT NULL&sheet=${charadexInfo.sheetPage}`).then(i => i.text()).then(JSON => {


        /* ================================================================ */
        /* And so it begins
        /* ================================================================ */
        let sheetArray = scrubData(JSON); // Clean up sheet data so we can use it


        /* ================================================================ */
        /* Load Up
        /* ================================================================ */
    
        $('#loading').hide();
        $('.masterlist-container').addClass('softload');


        /* ================================================================ */
        /* URL Param Junk
        /* ================================================================ */
        let singleItemParamKey = Object.keys(sheetArray[0])[0]; // Get the key for single objects
        let preParam = url.search.includes(charadexInfo.btnFilterCol) ? '?' + charadexInfo.btnFilterCol + '=' + urlParams.get(charadexInfo.btnFilterCol) + `&${singleItemParamKey}=` : `?${singleItemParamKey}=`; // Determines which is used in a link


        /* ================================================================ */
        /* URL Param Buttons
        /* ================================================================ */
        (() => {

            if (sheetArray[0].hasOwnProperty(charadexInfo.btnFilterCol)) {

                // Creates Param Object Array
                let urlParamArray = [];
                const uniqueArray = [...new Set(sheetArray.map(i => i[charadexInfo.btnFilterCol]))];
                uniqueArray.forEach((i) => {
                    urlParamArray.push({
                        title: i,
                        link: baseURL + '?' + charadexInfo.btnFilterCol + '=' + i.toLowerCase(),
                    });
                });

                // Adds All Button
                urlParamArray.unshift({ title: 'All', link: baseURL });

                // List.js options
                let buttonOptions = {
                    valueNames: ['title', { name: 'link', attr: 'href' }],
                    item: 'charadex-filter-buttons',
                };

                // Creates singular item
                let urlParamButtons = new List("filter-buttons", buttonOptions, urlParamArray);

                // Show Buttons
                $('#filter-buttons').show();

            }

            // Filters out information based on URL parameters
            if (urlParams.has(charadexInfo.btnFilterCol) && charadexInfo.btnFilterCol) { 
                sheetArray = sheetArray.filter((i) => i[charadexInfo.btnFilterCol].toLowerCase() === urlParams.get(charadexInfo.btnFilterCol).toLowerCase()); 
            }

        })();

        
        /* ================================================================ */
        /* Modifying Array (Adding Link)
        /* ================================================================ */
        for (var i in sheetArray){
            sheetArray[i].cardlink = baseURL + preParam + sheetArray[i][charadexInfo.singleItemParamVal];
        }

        // Reverse based on preference
        charadexInfo.itemOrder == 'asc' ? sheetArray.reverse() : '';


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
            itemArray[itemArray.indexOf('image')] = { name: 'image', attr: 'src' };

            return itemArray;

        };



        /* ================================================================ */
        /* Decide if Single Card or Not
        /* ================================================================ */
        if (urlParams.has(singleItemParamKey)) {

            /* ================================================================ */
            /* Prev & Next for Single Card
            /* ================================================================ */
            (() => {

                let index = sheetArray.map(function(i) {return i[singleItemParamKey];}).indexOf(urlParams.get(singleItemParamKey));
                let leftItem = sheetArray[index - 1];
                let rightItem = sheetArray[index + 1];

                // Prev
                if (leftItem) {
                    $("#entryPrev").attr("href", baseURL + preParam + leftItem[singleItemParamKey]);
                    $("#entryPrev span").text(leftItem[singleItemParamKey]);
                } else {
                    $("#entryPrev i").remove();
                }

                // Next
                if (rightItem) {
                    $("#entryNext").attr("href", baseURL + preParam + rightItem[singleItemParamKey]);
                    $("#entryNext span").text(rightItem[singleItemParamKey]);
                } else {
                    $("#entryNext i").remove();
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

                sheetArray = sheetArray.filter((i) => i[charadexInfo.singleItemParamVal].includes(urlParams.get(singleItemParamKey)))[0];

                // Creates singular item
                let charadexItem = new List("charadex-gallery", itemOptions, sheetArray);

            })();

        } else {

            /* ================================================================ */
            /* Charadex Gallery
            /* ================================================================ */

            // Add options to filters
            if (charadexInfo.filterCol) {
                const filterArr = [...new Set(sheetArray.map(i => i[charadexInfo.filterCol]))];
                if (filterArr > 2) {
                    addOptions(addAll(filterArr), $('#filter'));
                    $('#filter').parent().show();
                }
            }

            if (charadexInfo.searchParams) {
                addOptions(charadexInfo.searchParams, $('#search-filter'));
                $('#search-filter').parent().show();
            }

            // Show Filters
            $('#charadex-filters').show();

            // Create the Gallery
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

                // Calling all functions here
                charadexFilter(charadex, charadexInfo.filterCol);
                charadexSearch(charadex, charadexInfo.searchParams);
                charadexPrevNext();

            })();

        }
    })
};


/* ==================================================================== */
/* Charadex
======================================================================= */
const charadexSmall = (options) => {


    /* ==================================================================== */
    /* Options & URL
    ======================================================================= */
    let userOptions = options || {};
    const urlParams = new URLSearchParams(window.location.search);


    /* ==================================================================== */
    /* Sifting Through Options
    ======================================================================= */
    const charadexInfo = {
        sheetID: userOptions.sheetID ? userOptions.sheetID.includes('/d/') ? userOptions.sheetID.split('/d/')[1].split('/edit')[0] : userOptions.sheetID : "1l_F95Zhyj5OPQ0zs-54pqacO6bVDiH4rlh16VhPNFUc",
        sheetPage: userOptions.sheetPage ? userOptions.sheetPage : "Public Masterlist",
        itemAmount: userOptions.itemAmount ? userOptions.itemAmount : 12,
        itemOrder: userOptions.itemOrder ? userOptions.itemOrder : "desc",
        filterCol: userOptions.filterCol ? keyCreator(userOptions.filterCol) : false,
        searchParams: userOptions.searchParams ? addAll(userOptions.searchParams) : false,
        btnFilterCol: userOptions.btnFilterCol ? keyCreator(userOptions.btnFilterCol) : false,
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
        let preParam = url.search.includes(charadexInfo.btnFilterCol) ? `&${singleItemParamKey}=` : `?${singleItemParamKey}=`; // Determines which is used in a link


        /* ================================================================ */
        /* URL Param Buttons
        /* ================================================================ */
        (() => {

            if (sheetArray[0].hasOwnProperty(charadexInfo.btnFilterCol)) {

                // Creates Param Object Array
                let urlParamArray = [];
                const uniqueArray = [...new Set(sheetArray.map(i => i[charadexInfo.btnFilterCol]))];
                uniqueArray.forEach((i) => {
                    urlParamArray.push({
                        title: i,
                        link: baseURL + '?' + charadexInfo.btnFilterCol + '=' + i.toLowerCase(),
                    });
                });

                // Adds All Button
                urlParamArray.unshift({ title: 'All', link: baseURL });

                // List.js options
                let buttonOptions = {
                    valueNames: ['title', { name: 'link', attr: 'href' }],
                    item: 'charadex-filter-buttons',
                };

                // Creates singular item
                let urlParamButtons = new List("filter-buttons", buttonOptions, urlParamArray);

                // Show Buttons
                $('#filter-buttons').show();

            }

            // Filters out information based on URL parameters
            if (urlParams.has(charadexInfo.btnFilterCol) && charadexInfo.btnFilterCol) { 
                sheetArray = sheetArray.filter((i) => i[charadexInfo.btnFilterCol].toLowerCase() === urlParams.get(charadexInfo.btnFilterCol).toLowerCase()); 
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

            // Same for images
            itemArray[itemArray.indexOf('image')] = { name: 'image', attr: 'src' };

            return itemArray;

        };


        /* ================================================================ */
        /* Charadex Gallery
        /* ================================================================ */

        // Add options to filters
        if (charadexInfo.filterCol) {
            const filterArr = [...new Set(sheetArray.map(i => i[charadexInfo.filterCol]))];
            if (filterArr > 2) {
                addOptions(addAll(filterArr), $('#filter'));
                $('#filter').parent().show();
            }
        }

        if (charadexInfo.searchParams) {
            addOptions(charadexInfo.searchParams, $('#search-filter'));
            $('#search-filter').parent().show();
        }

        // Show Filters
        $('#charadex-filters').show();

        // Create the Gallery
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
            charadexFilter(charadex, charadexInfo.filterCol);
            charadexSearch(charadex, charadexInfo.searchParams);
            charadexPrevNext();

        })();

    })
};