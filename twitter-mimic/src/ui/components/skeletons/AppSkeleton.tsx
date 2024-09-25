import React from "react";
import ContentLoader from "react-content-loader";

export const GitHubLoading = (props: any) => (
  <ContentLoader 
    speed={2}
    width={476}
    height={124}
    viewBox="0 0 476 124"
    backgroundColor="#dfdddd"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="194" y="57" rx="3" ry="3" width="88" height="6" /> 
    <rect x="210" y="68" rx="3" ry="3" width="52" height="6" /> 
    <circle cx="236" cy="30" r="20" />
  </ContentLoader>
);
