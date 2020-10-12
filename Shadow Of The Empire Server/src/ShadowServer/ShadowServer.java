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
	static class Empire implements Serializable
	{
		/**
		 * 
		 */
		private static final long serialVersionUID = 1L;
		int wealth = 6;
		int military = 6;
		int consciousness = 6;
		int culture = 6;
		int piety = 6;
	}
	static void makeANewEmpire()
	{
		theEmpire = new Empire();
		FileSystem.save();
		System.exit(0);
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
//		License.regenerate();
//		makeANewEmpire();
		Websockets s = new Websockets();
		s.start();
	    System.out.println("Shadow of The Empire Server started on port: " + s.getPort());
	}
	static boolean doesPlayerExist(String sessionId)
	{
		return players.containsKey(sessionId);
	}
}
