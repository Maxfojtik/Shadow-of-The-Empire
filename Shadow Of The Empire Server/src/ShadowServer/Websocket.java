package ShadowServer;

import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

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
		sendProblems(conn, p);
	}
	
	static void sendProblems(WebSocket conn, Player p)
	{
		JSONObject json = new JSONObject();
		JSONArray problems = new JSONArray();
		json.put("hasSummited", p.hasSubmittedSolution);
		for(int i = 0; i < ShadowServer.theGame.problems.size(); i++)
		{
			Problem problem = ShadowServer.theGame.problems.get(i);
			JSONObject problemJson = new JSONObject();
			problemJson.put("problemText", problem.text);
			JSONArray proposedSolutions = new JSONArray();
			JSONArray givenSolutions = new JSONArray();
			for(int j = 0; j < problem.solutions.size(); j++)
			{
				Solution s = problem.solutions.get(j);
				if(s.playerSubmitted)
				{
					JSONObject solutionJson = new JSONObject();
					solutionJson.put("text", s.text);
					JSONArray solutionVotes = new JSONArray();
					for(int k = 0; k < s.whoVotedOnMe.size(); k++)
					{
						solutionVotes.put(s.whoVotedOnMe.get(k));
					}
					solutionJson.put("Votes", solutionVotes);
					proposedSolutions.put(s);
				}
				else
				{
					givenSolutions.put(s.text);
				}
			}
			problemJson.put("givenSolutions", givenSolutions);
			problemJson.put("proposedSolutions", proposedSolutions);
			problems.put(problemJson);
		}
		json.put("problems", problems);
		conn.send("Problems|"+json.toString());
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
				String session = params[1]+"|"+params[2];
				Player p = ShadowServer.theGame.players.get(session);
				if(p!=null && p.isAdmin)
				{
					String jsonRaw = params[3];
					JSONArray problemsJson = new JSONArray(jsonRaw);
					for(int i = 0; i < problemsJson.length(); i++)
					{
						JSONObject problemJson = problemsJson.getJSONObject(i);
						Problem problem = new Problem(problemJson.getString("problemText"));
						JSONArray optionsJson = problemJson.getJSONArray("optionsText");
						for(int k = 0; k < optionsJson.length(); k++)
						{
							Solution solution = new Solution(optionsJson.getString(k), false);
							problem.solutions.add(solution);
						}
						ShadowServer.theGame.problems.add(problem);
					}
				}
				else
				{
					conn.send("Error|You dont exist or you're not admin.");
				}
				ShadowServer.theGame.problemPhase = true;
				FileSystem.save();
			}
			catch(Exception e) {e.printStackTrace();conn.send("Error|Something went wrong in the JSON parse: "+e.getCause()+" "+e.getMessage());}
		}
		else if(params[0].equals("ChangeToVotingPhase"))
		{
			String session = params[1]+"|"+params[2];
			Player p = ShadowServer.theGame.players.get(session);
			if(p!=null && p.isAdmin)
			{
				ShadowServer.theGame.problemPhase = false;
				FileSystem.save();
			}
			else
			{
				conn.send("Error|You dont exist or you're not admin.");
			}
		}
		else if(params[0].equals("SetSlider"))
		{
			try
			{
				String session = params[1]+"|"+params[2];
				Player p = ShadowServer.theGame.players.get(session);
				if(p!=null && p.isAdmin)
				{
					int value = Integer.parseInt(params[4]);
					if(params[3].equals("Wealth"))
					{
						ShadowServer.theGame.theEmpire.wealth = value;
					}
					else if(params[3].equals("Military"))
					{
						ShadowServer.theGame.theEmpire.military = value;
					}
					else if(params[3].equals("Consciousness"))
					{
						ShadowServer.theGame.theEmpire.consciousness = value;
					}
					else if(params[3].equals("Culture"))
					{
						ShadowServer.theGame.theEmpire.culture = value;
					}
					else if(params[3].equals("Piety"))
					{
						ShadowServer.theGame.theEmpire.piety = value;
					}
					Collection<WebSocket> connections = getConnections();
					for(WebSocket socket : connections)
					{
						sendSliders(socket);
					}
					FileSystem.save();
				}
				else
				{
					conn.send("Error|You dont exist or you're not admin.");
				}
			}
			catch(NumberFormatException e)
			{
				conn.send("Error|Enter an integer please");
			}
			catch(Exception e)
			{
				conn.send("Error|"+e.toString());
			}
		}
//		else if(params[0].equals("Problems"))
//		{
//			sendProblems(conn, p);
//		}
		else if(params[0].equals("SubmitSolution"))
		{
			
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