package ShadowServer;

import java.io.IOException;
import java.io.Serializable;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.LinkedList;

import org.java_websocket.WebSocket;

public class ShadowServer 
{
	static HashMap<String, Player> players = new HashMap<>();
	class Empire implements Serializable
	{
		/**
		 * 
		 */
		private static final long serialVersionUID = 1L;
		int wealth = 1;
		int military = 2;
		int consciousness = 3;
		int culture = 4;
		int piety = 5;
	}
	static Empire theEmpire;
	public static void main(String args[]) throws InterruptedException
	{
		try {
			FileSystem.load();
		} catch (ClassNotFoundException | IOException e) {
			System.out.println("FAILED TO LOAD THE EMPIRE!");
			e.printStackTrace();
			System.exit(1);
		}
		Websockets s = new Websockets();
		s.start();
	    System.out.println("Shadow of The Empire Server started on port: " + s.getPort());
	}
	static boolean doesPlayerExist(String sessionId)
	{
		return players.containsKey(sessionId);
	}
}
