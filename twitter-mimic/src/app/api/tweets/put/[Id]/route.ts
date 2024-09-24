import { firestore } from "@/../../firebase/admin";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { Id: string } }
) {
  const { Id } = params;

  try {
    const { content, img } = await request.json();

    const docRef = firestore.collection("tweets").doc(Id);
    const doc = await docRef.get();
    console.log(doc)
    if (!doc.exists) throw new Error("Tweet no encontrado");

    await docRef.update({ content, img });

    return NextResponse.json(
      { message: "Tweet actualizado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error al actualizar el tweet" },
      { status: 500 }
    );
  }
}
