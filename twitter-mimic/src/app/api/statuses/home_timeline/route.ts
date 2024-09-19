import { NextResponse } from "next/server";

const timeline = [
  {
    userId: "0",
    avatar:
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/8f94f7d9-b68a-445e-a003-eceb64087873/dcsohgg-6068e5ed-b130-4e90-9d0e-2818ffef14bb.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzhmOTRmN2Q5LWI2OGEtNDQ1ZS1hMDAzLWVjZWI2NDA4Nzg3M1wvZGNzb2hnZy02MDY4ZTVlZC1iMTMwLTRlOTAtOWQwZS0yODE4ZmZlZjE0YmIuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.dxqnkfCNycNrkqzRpEXcx_7Py_LuhvSDunFDufPyBDM",
    userName: "wongmjane",
    content: `Twitter Web App now runs ES6+ for modern browsers*, reducing the polyfill bundle size
        by 83%
        
        (gzipped size went from 16.6 KB down to 2.7 KB!!)


        * Chrome 79+, Safari 14+, Firefox 68+`,
  },
  {
    userId: "1",
    avatar:
      "https://wallpapers.com/images/hd/random-pfp-of-fish-with-sunglasses-2wqsn5a94wc04vpv.jpg",
    userName: "jigcolapaolo",
    content: "Wow, Twitter Clone esta funcionando y vivo 🙌",
    name: "Juan Colapaolo",
  },
  {
    userId: "2",
    avatar:
      "https://i.pinimg.com/1200x/dc/28/a7/dc28a77f18bfc9aaa51c3f61080edda5.jpg",
    userName: "danielcruz",
    name: "Daniel de la Cruz",
    content: `Abro paraguas Paraguas
        
        Clean Code es un libro obsoleto que en 2020 con los paradigmas de desarrollo de software que
        manejamos, puede hacerte más daño que beneficio.`,
  },
  {
    userId: "3",
    avatar:
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/8f94f7d9-b68a-445e-a003-eceb64087873/dcsohgg-6068e5ed-b130-4e90-9d0e-2818ffef14bb.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzhmOTRmN2Q5LWI2OGEtNDQ1ZS1hMDAzLWVjZWI2NDA4Nzg3M1wvZGNzb2hnZy02MDY4ZTVlZC1iMTMwLTRlOTAtOWQwZS0yODE4ZmZlZjE0YmIuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.dxqnkfCNycNrkqzRpEXcx_7Py_LuhvSDunFDufPyBDM",
    userName: "wongmjane",
    content: `Twitter Web App now runs ES6+ for modern browsers*, reducing the polyfill bundle size
        by 83%
        
        (gzipped size went from 16.6 KB down to 2.7 KB!!)


        * Chrome 79+, Safari 14+, Firefox 68+`,
  },
  {
    userId: "4",
    avatar:
      "https://wallpapers.com/images/hd/random-pfp-of-fish-with-sunglasses-2wqsn5a94wc04vpv.jpg",
    userName: "jigcolapaolo",
    content: "Wow, Twitter Clone esta funcionando y vivo 🙌",
    name: "Juan Colapaolo",
  },
  {
    userId: "5",
    avatar:
      "https://i.pinimg.com/1200x/dc/28/a7/dc28a77f18bfc9aaa51c3f61080edda5.jpg",
    userName: "danielcruz",
    name: "Daniel de la Cruz",
    content: `Abro paraguas Paraguas
        
        Clean Code es un libro obsoleto que en 2020 con los paradigmas de desarrollo de software que
        manejamos, puede hacerte más daño que beneficio.`,
  },
  {
    userId: "6",
    avatar:
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/8f94f7d9-b68a-445e-a003-eceb64087873/dcsohgg-6068e5ed-b130-4e90-9d0e-2818ffef14bb.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzhmOTRmN2Q5LWI2OGEtNDQ1ZS1hMDAzLWVjZWI2NDA4Nzg3M1wvZGNzb2hnZy02MDY4ZTVlZC1iMTMwLTRlOTAtOWQwZS0yODE4ZmZlZjE0YmIuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.dxqnkfCNycNrkqzRpEXcx_7Py_LuhvSDunFDufPyBDM",
    userName: "wongmjane",
    content: `Twitter Web App now runs ES6+ for modern browsers*, reducing the polyfill bundle size
        by 83%
        
        (gzipped size went from 16.6 KB down to 2.7 KB!!)


        * Chrome 79+, Safari 14+, Firefox 68+`,
  },
  {
    userId: "7",
    avatar:
      "https://wallpapers.com/images/hd/random-pfp-of-fish-with-sunglasses-2wqsn5a94wc04vpv.jpg",
    userName: "jigcolapaolo",
    content: "Wow, Twitter Clone esta funcionando y vivo 🙌",
    name: "Juan Colapaolo",
  },
  {
    userId: "8",
    avatar:
      "https://i.pinimg.com/1200x/dc/28/a7/dc28a77f18bfc9aaa51c3f61080edda5.jpg",
    userName: "danielcruz",
    name: "Daniel de la Cruz",
    content: `Abro paraguas Paraguas
        
        Clean Code es un libro obsoleto que en 2020 con los paradigmas de desarrollo de software que
        manejamos, puede hacerte más daño que beneficio.`,
  },
];

export async function GET() {
  return NextResponse.json(timeline, { status: 200 });
}
