package ShadowServer;

import java.io.Serializable;
import java.util.ArrayList;

public class Problem implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	static class Solution implements Serializable
	{
		/**
		 * 
		 */
		private static final long serialVersionUID = 1L;
//		int votesFor = 0;
		String text = "";
		String title = "";
		boolean playerSubmitted = false;
		ArrayList<Player> whoVotedOnMe = new ArrayList<>();
		public Solution(String tex, String titl, boolean player)
		{
			text = tex;
			title = titl;
			playerSubmitted = player;
		}
	}
	ArrayList<Solution> solutions = new ArrayList<>();
	String text = "";
	String title = "";
	public Problem(String tex, String titl)
	{
		text = tex;
		title = titl;
	}
}
