/* ==================================================================== */
/* Dark/Light Toggle
======================================================================= */
  
const bodyClass = document.body.classList;

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && localStorage.getItem('toggle') == null) {
  bodyClass.add('dark');
} if (localStorage.getItem('toggle') == 'true') {
  bodyClass.add('dark');
}

$(document).on("click", "#toggle", function() {
  bodyClass.contains('dark')
    ? (bodyClass.remove('dark'))
    : (bodyClass.add('dark')); 
  localStorage.setItem('toggle', bodyClass.contains('dark'));
}); 


/* ==================================================================== */
/* Charadex
======================================================================= */
const charadex = (options) => {

  /* ==================================================================== */
  /* Options & URL
  ======================================================================= */
  let userOptions = options || {};
  let url = new URL(window.location.href);
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
    urlFilterParam: userOptions.urlFilterParam ? userOptions.urlFilterParam.toLowerCase().replace(/\s/g,'') : false,
  };


  /* ==================================================================== */
  /* Clean Sheet Data
  ======================================================================= */
  const scrubData = (sheetData) => {

    const scrubbedData = [];
    cleanJson = JSON.parse(sheetData.substring(47).slice(0, -2));

    const col = [];
    if (cleanJson.table.cols[0].label) {
      cleanJson.table.cols.forEach((headers) => {
        if (headers.label) {
          col.push(headers.label.toLowerCase().replace(/\s/g, ""));
        }
      });
    }

    cleanJson.table.rows.forEach((info) => {
      const row = {};
      const isBoolean = val => 'boolean' === typeof val;
      col.forEach((ele, ind) => {
        row[ele] = info.c[ind] != null ? info.c[ind].f != null && !isBoolean(info.c[ind].v) ? info.c[ind].f : info.c[ind].v != null ? info.c[ind].v : "" : "";
      });
      scrubbedData.push(row);
    });

    return scrubbedData;

  }


  /* ==================================================================== */
  /* Fetching the Sheet
  ======================================================================= */
  fetch(`https://docs.google.com/spreadsheets/d/${charadexInfo.sheetID}/gviz/tq?tqx=out:json&headers=1&sheet=${charadexInfo.sheetPage}`)
    .then(i => i.text())
    .then(JSON => {

      $('#loading').hide();
      $('.masterlist-container').addClass('softload');

      /* ================================================================ */
      /* And so it begins
      /* ================================================================ */
      let sheetArray = scrubData(JSON); // Clean up sheet data so we can use it
      let preParam = url.search.includes(charadexInfo.urlFilterParam) ? '&id=' : '?id='; // Determines which is used in a link


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
          urlParamArray.unshift({ title: 'All', link: url.href.split('&')[0].split('?')[0]});
      
          // Sorts list
          urlParamArray.sort((a, b) => {return a.title - b.title});
        
          // List.js options
          let buttonOptions = {
            valueNames: ['title', {name: 'link', attr: 'href'}],
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

        let len = sheetArray.length;
        while (len--) {

          // Adding link
          sheetArray[len].link = url.href + preParam + sheetArray[len].id;
          
          // Add vanila ID so it'll sort nicer
          sheetArray[len].orderID = sheetArray[len].id.replace(/\D+/gm,"");

        }
      
        // Sorts list from small to beeg number
        sheetArray.sort((a, b) => {return a.orderID - b.orderID})

        // Filters out information based on URL parameters
        if (urlParams.has(charadexInfo.urlFilterParam) && charadexInfo.urlFilterParam) {sheetArray = sheetArray.filter((i) => i[charadexInfo.urlFilterParam].toLowerCase() === urlParams.get(charadexInfo.urlFilterParam).toLowerCase());}

      })();


      /* ================================================================ */
      /* Keys
      /* (Allows list.js to call info from sheet)
      /* ================================================================ */
      let sheetArrayKeys = () => {

        let itemArray = Object.keys(sheetArray[0]);
        let imageIndex = itemArray.indexOf('image');
        let linkIndex = itemArray.indexOf('link');
        itemArray[imageIndex] = {name: 'image', attr: 'src'};
        itemArray[linkIndex] = {name: 'link', attr: 'href'};

        return itemArray;

      };


      if (urlParams.has('id')) {
        
        /* ================================================================ */
        /* Prev & Next for Single Card
        /* ================================================================ */
        (() => {

          let len = sheetArray.length;
          while (len--) {
            if (sheetArray[len].orderID == urlParams.get('id').replace(/\D+/gm,"")) {
              
              // Prev
              if (sheetArray[len - 1]) {
                $("#entryPrev").attr("href", url.href.split('?id')[0].split('&id')[0] + preParam + sheetArray[len - 1].id);
                $("#entryPrev span").text(sheetArray[len - 1].id);
              } else {
                $("#entryPrev i").remove();
              }

              // Next
              if (sheetArray[len + 1]) {
                console.log(sheetArray[len + 1]);
                $("#entryNext").attr("href", url.href.split('?id')[0].split('&id')[0] + preParam + sheetArray[len + 1].id);
                $("#entryNext span").text(sheetArray[len + 1].id);
              } else {
                $("#entryNext i").remove();
              }

            }
          }

          // Back to masterlist (keeps species parameter)
          $("#masterlistLink").attr("href", url.href.split('?id')[0].split('&id')[0]);

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
          let designID = urlParams.get('id');
          sheetArray = sheetArray.filter((i) => i.id.includes(designID))[0];

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
          charadex.sort("orderID", {order: charadexInfo.itemOrder,})

          /* ================================================================ */
          /* Custom Filter
          /* ================================================================ */
          $("#filter").on('change', () => {
            let selection = $("#filter option:selected").text().toLowerCase();
            let filterType = $("#filter").attr('filter');
            if (selection && !selection.includes('all')) {
              charadex.filter(function (i) {return i.values()[filterType].toLowerCase() == selection;});
            } else {
              charadex.filter();
            }
          });
          

          /* ================================================================ */
          /* Search Filter
          /* ================================================================ */
          $("#search-filter").on('change', () => {
            let selection = [$("#search-filter option:selected").text().toLowerCase()];
            if (selection && !selection.includes('all')) {
              $('#search').on('keyup', () => {
                let searchString = $('#search').val();
                charadex.search(searchString, selection);
              });
            }
          });
          

          /* ================================================================ */
          /* Prev/Next in Pagination
          /* ================================================================ */
          $('.btn-next').on('click', () => {$('.pagination .active').next().children('a')[0].click();})
          $('.btn-prev').on('click', () => {$('.pagination .active').prev().children('a')[0].click();})

        })();
        
      }

    })
};



