import * as React from "react";
import { SVGProps } from "react";

export default function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg style={{ color: "var(--primary-color)" }} xmlns="http://www.w3.org/2000/svg" width={21} height={21} {...props}>
      <g fill="currentColor" fillRule="evenodd">
        <circle cx={10.5} cy={10.5} r={1} />
        <circle cx={5.5} cy={10.5} r={1} />
        <circle cx={15.5} cy={10.5} r={1} />
      </g>
    </svg>
  );
}
