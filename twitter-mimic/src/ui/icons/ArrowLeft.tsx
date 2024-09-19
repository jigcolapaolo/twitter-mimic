import * as React from "react"
import { SVGProps } from "react"
export default function ArrowLeft(props: SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" width={21} height={21} stroke={props.stroke} {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.499 6.497 3.5 10.499l4 4.001M16.5 10.5h-13" />
    </g>
  </svg>
}
