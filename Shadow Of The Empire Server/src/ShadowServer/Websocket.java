package ShadowServer;

import java.net.InetSocketAddress;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.json.JSONArray;
import org.json.JSONObject;

import ShadowServer.Problem.Solution;


class Websockets extends WebSocketServer {
	public Websockets() {
		super(new InetSocketAddress(12398));
	}
	static void sendSliders(WebSocket conn)
	{
		conn.send("SliderValues|"+ShadowServer.theGame.theEmpire.wealth+"|"+ShadowServer.theGame.theEmpire.military+"|"+ShadowServer.theGame.theEmpire.consciousness+"|"+ShadowServer.theGame.theEmpire.culture+"|"+ShadowServer.theGame.theEmpire.piety); 
	}
	static void sendAccept(WebSocket conn, Player p)
	{
		conn.send("AcceptSessionID|"+p.sessionId+"|"+p.isAdmin+"|"+ShadowServer.theGame.problemPhase);
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
				Player thePlayer = ShadowServer.theGame.players.get(params[1]+"|"+params[2]);
				sendAccept(conn, thePlayer);
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
				ShadowServer.theGame.players.put(p.sessionId, p);
				License.usedCode(params[3]);
				FileSystem.save();
				conn.send("AcceptSignup");
				sendAccept(conn, p);
			}
		}
		else if(params[0].equals("Sliders"))
		{
			sendSliders(conn);
		}
		else if(params[0].equals("ChangeToProblemPhase"))
		{
			try
			{
				ShadowServer.theGame.problems.clear();
				String session = params[1];
				Player p = ShadowServer.theGame.players.get(session);
				if(p!=null && p.isAdmin)
				{
					String jsonRaw = params[2];
					JSONArray problemsJson = new JSONArray(jsonRaw);
					for(int i = 0; i < problemsJson.length(); i++)
					{
						JSONObject problemJson = problemsJson.getJSONObject(i);
						Problem problem = new Problem(problemJson.getString("problemText"));
						JSONArray optionsJson = problemJson.getJSONArray("optionsText");
						for(int k = 0; k < optionsJson.length(); k++)
						{
							Solution solution = new Solution(optionsJson.getString(k));
							problem.solutions.add(solution);
						}
						ShadowServer.theGame.problems.add(problem);
					}
				}
				ShadowServer.theGame.problemPhase = true;
			}
			catch(Exception e) {e.printStackTrace();conn.send("Error|Something went wrong in the JSON parse: "+e.getCause()+" "+e.getMessage());}
		}
		else if(params[0].equals("changeToVotingPhase"))
		{
			String session = params[1];
			Player p = ShadowServer.theGame.players.get(session);
			if(p!=null && p.isAdmin)
			{
				ShadowServer.theGame.problemPhase = false;
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