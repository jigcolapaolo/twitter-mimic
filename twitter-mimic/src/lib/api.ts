import { UserData } from "@/app/api/route";

export async function fetchUserData(): Promise<UserData> {

  await new Promise (resolve => setTimeout(resolve, 2000))

  const res = await fetch("http://localhost:3000/api")
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await res.json()

  return data
}
