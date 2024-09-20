import * as React from "react";
import { SVGProps } from "react";
export default function RetweetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 21 21"
      width={21}
      height={21}
      stroke={props.stroke}
      strokeWidth={1.5}
      {...props}
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m13.5 13.5 3 3 3-3" />
        <path d="M9.5 4.5h3a4 4 0 0 1 4 4v8M7.5 7.5l-3-3-3 3" />
        <path d="M11.5 16.5h-3a4 4 0 0 1-4-4v-8" />
      </g>
    </svg>
  );
}
