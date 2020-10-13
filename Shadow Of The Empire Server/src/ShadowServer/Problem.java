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
		int votesFor = 0;
		String text = "";
		public Solution(String t)
		{
			text = t;
		}
	}
	ArrayList<Solution> solutions = new ArrayList<>();
	String text = "";
	public Problem(String t)
	{
		text = t;
	}
}
