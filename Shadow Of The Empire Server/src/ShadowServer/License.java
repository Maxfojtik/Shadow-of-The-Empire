package ShadowServer;

import java.security.SecureRandom;
import java.util.ArrayList;

import ShadowServer.ShadowServer.Game;

public class License 
{

	static final String CONS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	static SecureRandom rnd = new SecureRandom();
	
	static String randomString( int len, String AB){
	   StringBuilder sb = new StringBuilder( len );
	   for( int i = 0; i < len; i++ ) 
	      sb.append( AB.charAt( rnd.nextInt(AB.length()) ) );
	   return sb.toString();
	}
	static String generateAdminId(Game g)
	{
		String potentialId = "";
		while(potentialId.equals(""))
		{
			potentialId = "A"+randomString(4, CONS);
			for(String lis : g.adminCodes)
			{
				if(lis.equals(potentialId))
				{
					potentialId = "";
				}
			}
		}
		g.adminCodes.add(potentialId);
		return potentialId;
	}
	static String generateUserId(Game g)
	{
		String potentialId = "";
		while(potentialId.equals(""))
		{
			potentialId = "B"+randomString(4, CONS);
			for(String lis : g.adminCodes)
			{
				if(lis.equals(potentialId))
				{
					potentialId = "";
				}
			}
		}
		g.userCodes.add(potentialId);
		return potentialId;
	}
	static void regenerate(Game g)
	{
		System.out.println("YOU ARE ABOUT TO GENERATE NEW CODES!!");
//		System.exit(1);
		g.players.clear();
		for(int i = 0; i < 100; i++)
		{
			generateAdminId(g);
		}
		for(int i = 0; i < 1000; i++)
		{
			generateUserId(g);
		}
	}
	static boolean isValid(String code)
	{
		return ShadowServer.theGame.adminCodes.contains(code) || ShadowServer.theGame.userCodes.contains(code);
	}
	static void usedCode(String code)
	{
		ShadowServer.theGame.userCodes.remove(code);
		ShadowServer.theGame.adminCodes.remove(code);
	}
	static boolean isAdmin(String code)
	{
		return code.charAt(0)=='A';
	}
}
