package ShadowServer;

import java.io.Serializable;

import ShadowServer.Problem.Solution;

public class Player implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	boolean isAdmin = false;
	String username = "";
	String password = "";
	String sessionId = "";
	boolean hasSubmittedSolution = false;
	Solution mySigniture = null;
	int[] myVotes = null;
	public Player(String user, String pass, boolean admin)// when someone signs up
	{
		username = user;
		password = pass;
		isAdmin = admin;
		sessionId = user+"|"+pass;
	}
}
