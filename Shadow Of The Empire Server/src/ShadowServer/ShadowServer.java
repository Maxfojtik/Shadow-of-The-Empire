package ShadowServer;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;

import ShadowServer.ShadowServer.Game;

public class ShadowServer 
{
	static class Game implements Serializable
	{
		/**
		 * 
		 */
		private static final long serialVersionUID = 1L;
		HashMap<String, Player> players = new HashMap<>();
		ArrayList<Problem> problems = new ArrayList<>();
		Boolean problemPhase = false;
		Empire theEmpire = new Empire();
		ArrayList<String> adminCodes = new ArrayList<>();
		ArrayList<String> userCodes = new ArrayList<>();
		boolean acceptNewSignups = true;
		public void newGame()
		{
//			System.out.println("YOU ARE ABOUT TO GENERATE NEW GAME!!");
//			System.exit(1);
//			License.regenerate(this);
//			FileSystem.save(this);
//			System.exit(0);
		}
	}
	static Game theGame;
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
		ShadowServer.theGame.theEmpire = new Empire();
		FileSystem.save();
		System.exit(0);
	}
	public static void main(String args[]) throws InterruptedException
	{
//		ShadowServer.theGame = new Game();
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
		return ShadowServer.theGame.players.containsKey(sessionId);
	}
}
