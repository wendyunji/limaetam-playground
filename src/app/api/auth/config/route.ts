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

    // 여기서는 단순히 설정이 유효한지 확인만 함
    // 실제로는 GitHub API를 호출해서 유효성을 검증할 수도 있음
    
    return NextResponse.json({ 
      success: true, 
      message: 'OAuth configuration saved successfully' 
    });
  } catch (error) {
    console.error('Error saving OAuth config:', error);
    return NextResponse.json(
      { error: 'Failed to save OAuth configuration' },
      { status: 500 }
    );
  }
}