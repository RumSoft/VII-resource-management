import React from "react";
import { Helmet } from "react-helmet";

export default function Title(props) {
  const title = props.children;
  const defaultTitle = "Rumsoft's Resource Manager";

  let fullTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;

  return (
    <Helmet>
      <title>{fullTitle}</title>
    </Helmet>
  );
}
