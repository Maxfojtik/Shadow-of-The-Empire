package ShadowServer;

import java.net.InetSocketAddress;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;


class Websockets extends WebSocketServer {
	public Websockets() {
		super(new InetSocketAddress(12398));
	}
	@Override
	public void onOpen(WebSocket conn, ClientHandshake handshake) {
		conn.send("UpdateState|InSliders"); //This method sends a message to the new client
		conn.send("SliderValues|"+ShadowServer.wealth+"|"+ShadowServer.military+"|"+ShadowServer.consciousness+"|"+ShadowServer.culture+"|"+ShadowServer.piety); //This method sends a message to the new client
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