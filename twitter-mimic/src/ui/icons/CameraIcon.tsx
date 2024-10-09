import * as React from "react";
import { SVGProps } from "react";
export function CameraIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={21} height={21} {...props}>
      <g fill="none" fillRule="evenodd">
        <path
          stroke="var(--primary-color)"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.5 14.5v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2z"
        />
        <path fill="var(--primary-color)" d="M17 9a1 1 0 1 0-2 0 1 1 0 0 0 2 0z" />
        <path
          stroke="var(--primary-color)"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 11.5a3 3 0 1 0-6 0 3 3 0 0 0 6 0zm-4-7h2a1 1 0 0 1 1 1v1h-4v-1a1 1 0 0 1 1-1z"
        />
      </g>
    </svg>
  );
}
