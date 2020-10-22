package ShadowServer;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.security.KeyStore.Entry;
import java.util.ArrayList;
import java.util.HashMap;

import ShadowServer.ShadowServer.Game;

public class FileSystem 
{
	static final String saveLocation = "C:/Users/Maxwell/Dropbox/ShadowServer/";
	public static void save(Game g)
	{
		try {
		 
            FileOutputStream fileOut = new FileOutputStream(saveLocation+"TheGame.game");
            ObjectOutputStream objectOut = new ObjectOutputStream(fileOut);
            objectOut.writeObject(g);
            objectOut.close();
            
            
            FileWriter myWriter = new FileWriter(saveLocation+"AdminCodes.txt");
			for(String code : g.adminCodes)
			{
				myWriter.write(code+"\n");
			}
			myWriter.close();
			
			  
			
			myWriter = new FileWriter(saveLocation+"UserCodes.txt");
			for(String code : g.userCodes)
			{
				myWriter.write(code+"\n");
			}
			myWriter.close();
			
			myWriter = new FileWriter(saveLocation+"Players.txt");
			myWriter.write("Username\tPassword\tisAdmin\n");
			for(java.util.Map.Entry<String, Player> entry : ShadowServer.theGame.players.entrySet())
			{
				myWriter.write(entry.getValue().username+"\t"+entry.getValue().password+"\t\t"+entry.getValue().isAdmin+"\n");
			}
			myWriter.close();
			
            System.out.println("Saved.");
 
        } catch (Exception ex) {
            ex.printStackTrace();
        }
	}
	public static void save()
	{
		save(ShadowServer.theGame);
	}
	@SuppressWarnings("unchecked")
	public static void load() throws ClassNotFoundException, IOException
	{
		FileInputStream fi = new FileInputStream(new File(saveLocation+"TheGame.game"));
		ObjectInputStream oi = new ObjectInputStream(fi);

		ShadowServer.theGame = (ShadowServer.Game) oi.readObject();
		oi.close();
		fi.close();
	}
	static void log(String str)
	{
		FileWriter myWriter;
		try {
			myWriter = new FileWriter(saveLocation+"rawLogs.txt", true);
			myWriter.write(str+"\n");
			myWriter.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
