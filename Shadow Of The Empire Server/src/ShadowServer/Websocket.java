package ShadowServer;

import java.net.InetSocketAddress;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;


class Websockets extends WebSocketServer {
	public Websockets() {
		super(new InetSocketAddress(12398));
	}
	static void sendSliders(WebSocket conn)
	{
		conn.send("SliderValues|"+ShadowServer.wealth+"|"+ShadowServer.military+"|"+ShadowServer.consciousness+"|"+ShadowServer.culture+"|"+ShadowServer.piety); 
	}
	@Override
	public void onOpen(WebSocket conn, ClientHandshake handshake) {
		conn.send("UpdateState|InSliders"); //This method sends a message to the new client
		sendSliders(conn);
		System.out.println(conn.getRemoteSocketAddress().getAddress().getHostAddress() + " connected");
	}

	@Override
	public void onClose(WebSocket conn, int code, String reason, boolean remote) {
		System.out.println(conn.getRemoteSocketAddress().getAddress().getHostAddress() + " disconnected");
	}

	@Override
	public void onMessage(WebSocket conn, String message) 
	{
		System.out.println(conn.getRemoteSocketAddress().getAddress().getHostAddress() + ": " + message);
		String[] params = message.split("\\|");
		if(params[0].equals("SetSessionId"))
		{
			if(ShadowServer.doesPlayerExist(params[1]))
			{
				conn.send("AcceptSessionID|"+ShadowServer.players.get(params[1]).sessionId);
			}
			else
			{
				try {
					Thread.sleep(500);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				conn.send("DenySessionID");
			}
		}
		else if(params[0].equals("Signup"))
		{
			if(ShadowServer.doesPlayerExist(params[1]))
			{
				conn.send("DenySignup");
			}
			else
			{
				Player p = new Player(params[1]);
				ShadowServer.players.put(p.sessionId, p);
				conn.send("AcceptSignup");
				conn.send("AcceptSessionID|"+p.sessionId);
			}
		}
		else if(params[0].equals("Sliders"))
		{
			sendSliders(conn);
		}
	}

	@Override
	public void onError(WebSocket conn, Exception ex) {
		ex.printStackTrace();
	}

	@Override
	public void onStart() {
	    setConnectionLostTimeout(60);
	}
}