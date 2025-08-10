import { FlexQL } from "./flexql";

const flexql = new FlexQL();
flexql.generate("username!=joe;age>20", {
  adapter: "raw-sql",
});
