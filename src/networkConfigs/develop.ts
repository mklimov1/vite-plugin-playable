import { createNetworkConfig } from "./../scripts";

const NAME = "develop";

export const develop = createNetworkConfig({
  name: NAME,
  ctaFunction: `
    function cta() {
      console.log("CTA clicked");
    }
  `,
  scripts: [],
});
