import { CardControllerService } from "@/api";
import { Car } from "lucide-react";
import { NextResponse } from "next/server";
import { json } from "stream/consumers";



export async function GET() {
    try {
        const cards = await CardControllerService.card();
        return NextResponse.json(cards);
    } catch (error) {
        console.error('Error fetching cards:', error);
        return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const requestBody = await request.json();
        const newCard = await CardControllerService.addCard(requestBody);
        return NextResponse.json(newCard, { status: 201 });
    } catch (error) {
        console.error('Error adding card:', error);
        return NextResponse.json({ error: 'Failed to add card' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const requestBody = await request.json();
        const updatedCard = await CardControllerService.updateCard(requestBody);
        return NextResponse.json(updatedCard);
    } catch (error) {
        console.error('Error updating card:', error);
        return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
    }
}