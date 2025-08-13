import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { clientId, clientSecret } = await request.json();

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Client ID and Client Secret are required' },
        { status: 400 }
      );
    }

    // 환경 변수 동적 업데이트
    process.env.GITHUB_CLIENT_ID = clientId;
    process.env.GITHUB_CLIENT_SECRET = clientSecret;

    return NextResponse.json({ 
      success: true, 
      message: 'OAuth configuration updated successfully' 
    });
  } catch (error) {
    console.error('Error updating OAuth config:', error);
    return NextResponse.json(
      { error: 'Failed to update OAuth configuration' },
      { status: 500 }
    );
  }
}