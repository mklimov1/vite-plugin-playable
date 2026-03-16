import { createNetworkConfig } from "./../scripts";

const NAME = "ironSource";

export const ironSource = createNetworkConfig({
  name: NAME,
  ctaFunction: `
    function cta() {
      if (typeof dapi !== "undefined") {
        dapi.openStoreUrl();
      } else if (typeof mraid !== "undefined") {
        mraid.open(window.__storeUrl);
      }
    }
  `,
  scripts: ['<script src="https://s3.amazonaws.com/mraid/mraid.js"></script>'],
});
