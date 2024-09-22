import { NextResponse } from "next/server";
import { firestore } from "../../../../../../firebase/admin";

export async function DELETE (request: Request, { params }: { params: { Id: string } }) {

    const { Id } = params;
    try {
        
        const docRef = firestore.collection("tweets").doc(Id);
        await docRef.delete();
        
        return NextResponse.json({ message: "Tweet eliminado exitosamente" }, { status: 200 });

    } catch (error) {
        // console.error("Error eliminando el tweet: ", error);

        return NextResponse.json({ message: "Error al eliminar el tweet" }, { status: 500 });
    }

}