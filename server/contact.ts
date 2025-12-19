"use server";

import { db } from "@/db/drizzle";
import { signup } from "@/db/schema";

export async function createContact(username: string, email: string, phone: string, message: string = "") {
    try {
        await db.insert(signup).values({
            username,
            email,
            phone,
            message,
        });
    } catch (error) {
        console.log('error: ', error);
        throw new Error('Failed to submit form');
    }
}