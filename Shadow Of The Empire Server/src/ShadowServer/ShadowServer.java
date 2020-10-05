package ShadowServer;

import java.util.LinkedList;

import org.java_websocket.WebSocket;

public class ShadowServer 
{
	static LinkedList<Player> allPlayers = new LinkedList<Player>();
	public static void main(String args[]) throws InterruptedException
	{
		Websockets s = new Websockets();
		s.start();
	    System.out.println("Avalon Server started on port: " + s.getPort());
	    while(true)
	    {
	    	for(int i = 0; i < allPlayers.size(); i++)
	    	{
	    		if(allPlayers.get(i).disconnectTime!=-1 && System.currentTimeMillis()-allPlayers.get(i).disconnectTime>5000)
	    		{
	    			System.out.println("Removing inactive player "+allPlayers.get(i));
	    			ShadowServer.playerDisconnected(allPlayers.get(i));
	    			i--;
	    		}
	    	}
	    	Thread.sleep(100);
	    }
	}
	static Player getPlayerById(String id)
	{
		for(int i = 0; i < allPlayers.size(); i++)
		{
			if(allPlayers.get(i).sessionID.equals(id))
			{
				return allPlayers.get(i);
			}
		}
		return null;
	}
	static Player getPlayerByWebsocket(WebSocket sock)
	{
		for(int i = 0; i < allPlayers.size(); i++)
		{
			if(allPlayers.get(i).socket.equals(sock))
			{
				return allPlayers.get(i);
			}
		}
		return null;
	}
	static void playerDisconnected(Player dced)
	{
		allPlayers.remove(dced);
	}
}
