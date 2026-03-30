import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function fetchData(endpoint: string) {
  const response = await fetch(`/api/${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  return response.json();
}



export async function postData(endpoint: string, data: any) {
    const response = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`Failed to post to ${endpoint}`);
    }
    return response.json();
}

export async function putData(endpoint: string, data: any) {
    const response = await fetch(`/api/${endpoint}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`Failed to put to ${endpoint}`);
    }
    return response.json();
}

export async function deleteData(endpoint: string) {
    const response = await fetch(`/api/${endpoint}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Failed to delete ${endpoint}`);
    }
    return response.json();
}