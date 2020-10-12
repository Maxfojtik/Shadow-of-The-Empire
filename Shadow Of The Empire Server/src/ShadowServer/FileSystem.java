package ShadowServer;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.ArrayList;
import java.util.HashMap;

public class FileSystem 
{
	static final String saveLocation = "C:/Users/Maxwell/Dropbox/ShadowServer/";
	public static void save()
	{
		try {
		 
            FileOutputStream fileOut = new FileOutputStream(saveLocation+"Players.hm");
            ObjectOutputStream objectOut = new ObjectOutputStream(fileOut);
            objectOut.writeObject(ShadowServer.players);
            objectOut.close();
            
            
            fileOut = new FileOutputStream(saveLocation+"TheEmpire.em");
            objectOut = new ObjectOutputStream(fileOut);
            objectOut.writeObject(ShadowServer.theEmpire);
            objectOut.close();
            
  	      
			fileOut = new FileOutputStream(saveLocation+"UserCodes.codes");
			objectOut = new ObjectOutputStream(fileOut);
            objectOut.writeObject(License.userCodes);
            objectOut.close();
            
            fileOut = new FileOutputStream(saveLocation+"AdminCodes.codes");
  	      	objectOut = new ObjectOutputStream(fileOut);
            objectOut.writeObject(License.adminCodes);
            objectOut.close();
            
            
            System.out.println("Saved.");
 
        } catch (Exception ex) {
            ex.printStackTrace();
        }
	}
	@SuppressWarnings("unchecked")
	public static void load() throws ClassNotFoundException, IOException
	{
		FileInputStream fi = new FileInputStream(new File(saveLocation+"Players.hm"));
		ObjectInputStream oi = new ObjectInputStream(fi);

		HashMap<String, Player> pr1 = (HashMap<String, Player>) oi.readObject();
		ShadowServer.players = pr1;
		oi.close();
		fi.close();
		
		fi = new FileInputStream(new File(saveLocation+"TheEmpire.em"));
		oi = new ObjectInputStream(fi);
		ShadowServer.theEmpire = (ShadowServer.Empire) oi.readObject();
		oi.close();
		fi.close();

		fi = new FileInputStream(new File(saveLocation+"AdminCodes.codes"));
		oi = new ObjectInputStream(fi);
		License.adminCodes = (ArrayList<String>) oi.readObject();
		oi.close();
		fi.close();
		
		
		fi = new FileInputStream(new File(saveLocation+"UserCodes.codes"));
		oi = new ObjectInputStream(fi);
		License.userCodes = (ArrayList<String>) oi.readObject();
		oi.close();
		fi.close();
	}
}
