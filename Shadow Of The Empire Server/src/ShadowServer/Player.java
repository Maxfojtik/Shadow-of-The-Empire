package ShadowServer;

import java.io.Serializable;

public class Player implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	String sessionId = "";
	public Player(String id)// when someone signs up
	{
		sessionId = id;
	}
}
