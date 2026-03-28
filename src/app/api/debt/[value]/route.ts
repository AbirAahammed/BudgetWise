import { CardControllerService } from "@/api";
import { NextResponse } from "next/server";


export async function DELETE(request: Request,
    { params }: { params: { id: number } }
) {
    try {
        const requestBody = await request.json();
        await CardControllerService.deleteCard(params.id);
        return NextResponse.json(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting card:', error);
        return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
    }
}