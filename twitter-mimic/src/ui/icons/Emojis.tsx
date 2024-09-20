import * as React from "react";
import { SVGProps } from "react";

export function SadEmojiIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width={21} height={21} {...props}>
      <g fill="none" fillRule="evenodd" transform="translate(2 2)">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.5 16.5a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"
        />
        <circle cx={6} cy={6} r={1} fill="currentColor" />
        <circle cx={11} cy={6} r={1} fill="currentColor" />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.5 11.5c.603-1.333 1.603-2 3-2s2.397.667 3 2"
        />
      </g>
    </svg>
  );
}
