import { Server as SocketIOServer } from 'socket.io'
import type { Server as HTTPServer } from 'http'
import type { Socket as NetSocket } from 'net'
import type { NextApiRequest, NextApiResponse } from 'next'
import { chatWithKimi } from '@/lib/kimi'

interface SocketServer extends HTTPServer {
  io?: SocketIOServer
}

interface SocketWithIO extends NetSocket {
  server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new SocketIOServer(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {
      console.log('Client connected')
      let lastHeartbeat = Date.now();

      // 处理心跳
      socket.on('ping', () => {
        console.log('Received ping from client');
        lastHeartbeat = Date.now();
        socket.emit('pong');
      });

      // 检查连接是否存活
      const heartbeatCheck = setInterval(() => {
        const timeElapsed = Date.now() - lastHeartbeat;
        if (timeElapsed > 60000) { // 60秒没有心跳就断开连接
          console.log('Client heartbeat timeout');
          socket.disconnect(true);
          clearInterval(heartbeatCheck);
        }
      }, 30000);

      socket.on('message', async (message) => {
        console.log('Received message:', message)

        try {
          const kimiResponse = await chatWithKimi([
            { role: "user", content: message.content }
          ]);

          const response = {
            id: Date.now().toString(),
            content: kimiResponse.choices[0].message.content || '抱歉，我没有理解您的问题。',
            role: 'assistant',
            timestamp: new Date()
          }

          socket.emit('message', response)
        } catch (error) {
          console.error('Kimi API error:', error)
          socket.emit('error', { message: '服务器错误，请稍后再试' })
        }
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected')
        clearInterval(heartbeatCheck);
      })
    })
  }
  res.end()
}

export default SocketHandler