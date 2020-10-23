package ShadowServer;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.ArrayList;

import org.json.JSONArray;

import ShadowServer.Problem.Solution;
import ShadowServer.ShadowServer.Empire;

public class ThePast 
{
	static class Phase implements Serializable
	{
		/**
		 * 
		 */
		private static final long serialVersionUID = 1L;
		ArrayList<Problem> phaseProblems;
		Empire gameAtPhase;
		Boolean problemsPhase = false;
		@SuppressWarnings("unchecked")
		public Phase(ArrayList<Problem> ps, Empire g, Boolean pp)
		{
			phaseProblems = (ArrayList<Problem>) copy(ps);
			gameAtPhase = (Empire) copy(g);
			problemsPhase = (Boolean) copy(pp);
		}
	}
	
	static void save() throws IOException
	{
		Phase pastPhase = new Phase(ShadowServer.theGame.problems, ShadowServer.theGame.theEmpire, ShadowServer.theGame.problemPhase);
		System.out.println(pastPhase.problemsPhase);
		if(ShadowServer.theGame.allPhases==null)
		{
			ShadowServer.theGame.allPhases = new ArrayList<Phase>();
		}
		ShadowServer.theGame.allPhases.add(pastPhase);
		
		FileWriter myWriter = new FileWriter(FileSystem.saveLocation+"The Past.txt");
		for(int i = 0; i < ShadowServer.theGame.allPhases.size(); i++)
		{
			Phase p = ShadowServer.theGame.allPhases.get(i);
			myWriter.write("\n\n");
			myWriter.write( (p.problemsPhase ? "End of Problems Phase " : "End of Voting Phase ")+i/2+":\n");
			myWriter.write("Game state at phase: Wealth: "+p.gameAtPhase.wealth+" Military: "+p.gameAtPhase.military+" Consciousness: "+p.gameAtPhase.consciousness+" Culture: "+p.gameAtPhase.culture+" Piety: "+p.gameAtPhase.piety+"\n");
			for(int o = 0; o < p.phaseProblems.size(); o++)
			{
				Problem prob = p.phaseProblems.get(o);
				myWriter.write("Problem "+(o+1)+"\n");
				myWriter.write(prob.title+"\n");
				myWriter.write(prob.text+"\n");
				for(int k = 0; k < prob.solutions.size(); k++)
				{
					Solution sol = prob.solutions.get(k);
					myWriter.write("Solution "+(k+1)+"\n");
					myWriter.write(sol.title+"\n");
					myWriter.write(sol.text+"\n");
					if(p.problemsPhase)
					{
						myWriter.write("Signitures: \n");
						JSONArray arr = new JSONArray();
						for(Player signedPlayer : sol.whoSignedOnMe)
						{
							arr.put(signedPlayer.username);
						}
						myWriter.write(arr+" \n");
					}
					else
					{
						myWriter.write("Votes: \n");
						JSONArray arr = new JSONArray();
						for(Player signedPlayer : sol.whoVotedOnMe)
						{
							arr.put(signedPlayer.username);
						}
						myWriter.write(arr+" \n");
					}
					if(sol.playerSubmitted!=null)
					{
						myWriter.write("Player Submitted: "+sol.playerSubmitted.username+"\n");
					}
					else
					{
						myWriter.write("Player Submitted: false\n");
					}
				}
			}
		}
		myWriter.flush();
		myWriter.close();
		System.out.println("Logged.");
	}
	public static Object copy(Object orig) {
        Object obj = null;
        try {
            // Write the object out to a byte array
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            ObjectOutputStream out = new ObjectOutputStream(bos);
            out.writeObject(orig);
            out.flush();
            out.close();

            // Make an input stream from the byte array and read
            // a copy of the object back in.
            ObjectInputStream in = new ObjectInputStream(
                new ByteArrayInputStream(bos.toByteArray()));
            obj = in.readObject();
        }
        catch(IOException e) {
            e.printStackTrace();
        }
        catch(ClassNotFoundException cnfe) {
            cnfe.printStackTrace();
        }
        return obj;
    }
}
