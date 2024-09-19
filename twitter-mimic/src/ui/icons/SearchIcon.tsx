import * as React from "react"
import { SVGProps } from "react"
export default function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" width={21} height={21} stroke={props.stroke} {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={8.5} cy={8.5} r={5} />
      <path d="M17.571 17.5 12 12" />
    </g>
  </svg>
}
