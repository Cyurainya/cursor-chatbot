import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 只处理 WebSocket 升级请求
  if (request.headers.get('upgrade') === 'websocket') {
    return NextResponse.next()
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/api/socket',
}