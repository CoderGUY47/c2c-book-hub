import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch from external source");
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Lottie Proxy Error:", error);
    return NextResponse.json({ error: "Failed to load animation" }, { status: 500 });
  }
}
