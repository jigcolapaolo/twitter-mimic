import * as React from "react";
import { SVGProps } from "react";
export default function SignOutIcon (props: SVGProps<SVGSVGElement>) {
  return (
    <svg id="sign-out-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" width={21} height={21} {...props}>
      <g
        fill={props.fill}
        fillRule="evenodd"
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m7.405 13.5-2.905-3 2.905-3M4.5 10.5h9M7.5 3.5l8 .002c1.104.001 2 .896 2 2v9.995c0 1.105-.896 2-2 2l-8 .003" />
      </g>
    </svg>
  );
}
