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
		Player playerSubmitted = null;
		ArrayList<Player> whoSignedOnMe = new ArrayList<>();
		ArrayList<Player> whoVotedOnMe = new ArrayList<>();
		public Solution(String titl, String tex, Player player)
		{
			text = tex;
			title = titl;
			playerSubmitted = player;
		}
	}
	ArrayList<Solution> solutions = new ArrayList<>();
	String text = "";
	String title = "";
	public Problem(String titl, String tex)
	{
		text = tex;
		title = titl;
	}
	int numberOfPremades()
	{
		int i = 0;
		for(Solution solution : solutions)
		{
			if(solution.playerSubmitted==null)
			{
				i++;
			}
		}
		return i;
	}
}
