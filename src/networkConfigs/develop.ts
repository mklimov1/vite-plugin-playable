import { createNetworkConfig } from "./../scripts";

export const develop = createNetworkConfig({
  name: "develop",
  inline: false,
  ctaFunction: `
    function cta() {
      console.log("CTA clicked");
    }
  `,
  scripts: [],
});

export const developInline = createNetworkConfig({
  name: "develop-inline",
  inline: true,
  ctaFunction: `
    function cta() {
      console.log("CTA clicked");
    }
  `,
  scripts: [],
});
