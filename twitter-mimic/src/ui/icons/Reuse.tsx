import * as React from "react"
import { SVGProps } from "react"
export default function ReuseIcon(props: SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" width={21} height={21} stroke={props.stroke} {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 2.5h5v5" />
      <path d="M8.5 2.5c-3.333 2.837-5 5.67-5 8.5s1 5.33 3 7.5M17.5 18.5h-5v-5" />
      <path d="M12.5 18.5c3.333-2.837 5-5.67 5-8.5s-1-5.33-3-7.5" />
    </g>
  </svg>
}
