package ShadowServer;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
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
            
            
            FileWriter myWriter = new FileWriter("C:/Users/Maxwell/Dropbox/ShadowServer/AdminCodes.txt");
			for(String code : g.adminCodes)
			{
				myWriter.write(code+"\n");
			}
			myWriter.close();
			
			  
			
			myWriter = new FileWriter("C:/Users/Maxwell/Dropbox/ShadowServer/UserCodes.txt");
			for(String code : g.userCodes)
			{
				myWriter.write(code+"\n");
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
}
