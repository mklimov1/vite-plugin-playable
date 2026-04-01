import { createNetworkConfig } from "./../scripts";

const CTA = `function cta() {console.log("CTA clicked");}`;
const script = '<script>"some script is here"</script>';

export const develop = createNetworkConfig({
  name: "develop",
  inline: false,
  ctaFunction: CTA,
  scripts: [script],
});

export const developInline = createNetworkConfig({
  name: "develop-inline",
  inline: true,
  ctaFunction: CTA,
  scripts: [script],
});
