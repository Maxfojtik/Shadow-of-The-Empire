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
		conn.send("SliderValues|"+ShadowServer.theEmpire.wealth+"|"+ShadowServer.theEmpire.military+"|"+ShadowServer.theEmpire.consciousness+"|"+ShadowServer.theEmpire.culture+"|"+ShadowServer.theEmpire.piety); 
	}
	@Override
	public void onOpen(WebSocket conn, ClientHandshake handshake) {
		sendSliders(conn);
		conn.send("UpdateState|InSliders"); //This method sends a message to the new client
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
			if(ShadowServer.doesPlayerExist(params[1]+"|"+params[2]))
			{
				Player thePlayer = ShadowServer.players.get(params[1]+"|"+params[2]);
				conn.send("AcceptSessionID|"+thePlayer.sessionId+"|"+thePlayer.isAdmin);
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
				conn.send("DenySignup|The username has already been taken");
			}
			else if(!License.isValid(params[3]))
			{
				conn.send("DenySignup|The code you gave was WRONG!");
			}
			else
			{
				Player p = new Player(params[1], params[2], License.isAdmin(params[3]));
				System.out.println(params[1]+" created an account with "+params[2]+" as password and the code of "+params[3]);
				ShadowServer.players.put(p.sessionId, p);
				License.usedCode(params[3]);
				FileSystem.save();
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