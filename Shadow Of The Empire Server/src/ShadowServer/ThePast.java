package ShadowServer;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.ArrayList;

import ShadowServer.Problem.Solution;
import ShadowServer.ShadowServer.Empire;

public class ThePast 
{
	static class Phase
	{
		ArrayList<Problem> phaseProblems;
		Empire gameAtPhase;
		boolean problemsPhase = false;
		@SuppressWarnings("unchecked")
		public Phase(ArrayList<Problem> ps, Empire g, boolean pp)
		{
			phaseProblems = (ArrayList<Problem>) copy(ps);
			gameAtPhase = (Empire) copy(g);
			problemsPhase = (boolean) copy(pp);
		}
	}
	static ArrayList<Phase> allPhases = new ArrayList<>();
	static void save() throws IOException
	{
		Phase pastPhase = new Phase(ShadowServer.theGame.problems, ShadowServer.theGame.theEmpire, ShadowServer.theGame.problemPhase);
		allPhases.add(pastPhase);
		
		FileWriter myWriter = new FileWriter(FileSystem.saveLocation+"The Past.txt");
		for(int i = 0; i < allPhases.size(); i++)
		{
			Phase p = allPhases.get(i);
			myWriter.write(i/2+" " + (p.problemsPhase ? " Problems Phase\n" : " Voting Phase\n"));
			myWriter.write("Game state at phase: Wealth: "+p.gameAtPhase.wealth+" Military: "+p.gameAtPhase.military+" Consciousness: "+p.gameAtPhase.consciousness+" Culture: "+p.gameAtPhase.culture+" Piety: "+p.gameAtPhase.piety+"\n");
			for(Problem prob : p.phaseProblems)
			{
				myWriter.write(prob.title+"\n");
				myWriter.write(prob.text+"\n");
				for(int k = 0; k < prob.solutions.size(); i++)
				{
					Solution sol = prob.solutions.get(k);
					myWriter.write("Solution "+i+"\n");
					myWriter.write(sol.title+"\n");
					myWriter.write(sol.text+"\n");
					if(p.problemsPhase)
					{
						myWriter.write("Signitures: \n");
						myWriter.write(sol.whoSignedOnMe+" ");
					}
					else
					{
						myWriter.write("Votes: \n");
						myWriter.write(sol.whoVotedOnMe+" ");
					}
					myWriter.write("Player Submitted: "+sol.playerSubmitted==null ? "false" : sol.playerSubmitted.username);
				}
			}
		}
		myWriter.flush();
		myWriter.close();
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
