// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// export function useError() {
//   const [error, setError] = useState<string | null>(null);

//   const searchParams = useSearchParams();
//   const router = useRouter();

//   useEffect(() => {
//     const query = searchParams.get("error");

//     if (query) {
//       setError(query);
//       router.replace("/home");
//     }
//   }, [searchParams, router]);

//   useEffect(() => {
//     if (error) {
//       toast.error("El ID del Tweet no es válido.");
//       setError(null);
//     }
//   }, [error]);
// }
