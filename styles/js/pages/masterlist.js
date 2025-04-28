/* ==================================================================== */
/* Import Charadex
======================================================================= */
import { charadex } from '../charadex.js';


/* ==================================================================== */
/* Load
======================================================================= */
document.addEventListener("DOMContentLoaded", async () => {

  let dex = await charadex.initialize.page(
    null,
    charadex.page.masterlist,
    null, 
    async (listData) => {

      if (listData.type == 'profile') {

        // Create the log dex
        if (charadex.tools.checkArray(listData.array[0].masterlistlog)) {
          let logs = await charadex.initialize.page(
            listData.array[0].masterlistlog,
            charadex.page.masterlist.relatedData['masterlist log'],
            null, 
            null,
            null,
            'log'
          );
        }

      }

    }
  );
  
  charadex.tools.loadPage('.softload', 500);
  
});