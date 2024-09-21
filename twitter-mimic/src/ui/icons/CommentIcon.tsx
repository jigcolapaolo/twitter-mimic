import * as React from "react";
import { SVGProps } from "react";

export default function CommentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={21} height={21} {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 16.517c4.418 0 8-3.284 8-7.017C19 5.767 15.418 3 11 3S3 6.026 3 9.759c0 1.457.546 2.807 1.475 3.91L3.5 18.25l3.916-2.447a9.181 9.181 0 0 0 3.584.714z"
      />
    </svg>
  );
}
