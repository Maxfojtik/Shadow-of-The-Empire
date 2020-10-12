package ShadowServer;

import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.security.SecureRandom;
import java.util.ArrayList;

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
	static ArrayList<String> adminCodes = new ArrayList<>();
	static ArrayList<String> userCodes = new ArrayList<>();
	static String generateAdminId()
	{
		String potentialId = "";
		while(potentialId.equals(""))
		{
			potentialId = "A"+randomString(4, CONS);
			for(String lis : adminCodes)
			{
				if(lis.equals(potentialId))
				{
					potentialId = "";
				}
			}
		}
		adminCodes.add(potentialId);
		return potentialId;
	}
	static String generateUserId()
	{
		String potentialId = "";
		while(potentialId.equals(""))
		{
			potentialId = "B"+randomString(4, CONS);
			for(String lis : adminCodes)
			{
				if(lis.equals(potentialId))
				{
					potentialId = "";
				}
			}
		}
		userCodes.add(potentialId);
		return potentialId;
	}
	static void regenerate()
	{
		System.out.println("YOU ARE ABOUT TO GENERATE NEW CODES!!");
		System.exit(1);
		ShadowServer.players.clear();
		for(int i = 0; i < 100; i++)
		{
			generateAdminId();
		}
		for(int i = 0; i < 1000; i++)
		{
			generateUserId();
		}
		FileSystem.save();
		System.exit(0);
	}
	static boolean isValid(String code)
	{
		return adminCodes.contains(code) || userCodes.contains(code);
	}
	static void usedCode(String code)
	{
		userCodes.remove(code);
		adminCodes.remove(code);
	}
	static boolean isAdmin(String code)
	{
		return code.charAt(0)=='A';
	}
}
