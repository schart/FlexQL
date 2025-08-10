import { FlexQL } from "./flexql";

const flexql = new FlexQL();
flexql.generate("CategoryName==Beverages,age>10", {
  adapter: "raw-sql",
});
