package ShadowServer;

import java.util.HashMap;
import java.util.LinkedList;

import org.java_websocket.WebSocket;

public class ShadowServer 
{
	static HashMap<String, Player> players = new HashMap<>();
	static double wealth = 1;
	static double military = 2;
	static double consciousness = 3;
	static double culture = 4;
	static double piety = 5;
	public static void main(String args[]) throws InterruptedException
	{
		Websockets s = new Websockets();
		s.start();
	    System.out.println("Shadow of The Empire Server started on port: " + s.getPort());
	}
	static boolean doesPlayerExist(String sessionId)
	{
		return players.containsKey(sessionId);
	}
}
