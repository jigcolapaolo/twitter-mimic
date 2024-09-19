// src/app/api/tweets/[id]/route.ts
import { NextResponse } from "next/server";
import { firestore } from '@/../../firebase/admin';


export async function GET(request: Request, { params }: { params: { Id: string } }) {
  const { Id } = params;

  try {
    const docRef = firestore.collection("tweets").doc(Id);
    const doc = await docRef.get();
    if (doc.exists) {
      const data = doc.data();
      const id = doc.id;
      const createdAt = data?.createdAt;
      const normalizedCreatedAt = +createdAt.toDate();

      return NextResponse.json({
        ...data,
        id,
        createdAt: normalizedCreatedAt,
      });
    } else {
      return NextResponse.json({ message: "Documento no encontrado" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Error al obtener el documento" + error }, { status: 500 });
  }
}
