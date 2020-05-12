package TweetCompiler;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Iterator;
import java.util.Scanner;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;
import org.json.simple.parser.JSONParser;

//--------------------------------------------------------------------------
// TweetExtractor Class
//
// This class extracts hashtags and urls from the collected tweets and saves
// them to the "Output" folder. This class assumes there are folders called 
// "Output" and "Input" exists in the project directory.
//--------------------------------------------------------------------------
public class TweetExtractor {
	//This builds the string in-memory of hashtags and urls
	private static StringBuilder entities = new StringBuilder("");
	// Used to limit 10 hashtags or urls per line for ease of reading output
	private static int lineLength = 0;
	// Used to only write to file when there are 1000 lines
	private static int lineCount = 0;
	static JSONParser parser = new JSONParser();

	private static int fileCount = 1;
	private static File extractedTweetFile = new File("Output/HashURLFile" + fileCount + ".txt");
	
	// Constructor creates the initial file to save the hashtags and urls
	public TweetExtractor() { createFile(); }

	//--------------------------------------------------------------------------
	// run
	//
	// This function begins extracting hashtags and urls from the tweet files
	// in the "Input" folder in the project directory
	//--------------------------------------------------------------------------
	public static void run() {
		// Folder of input files containing JSON tweets with 1 tweet per line
		File tweetFolder = new File("Input");
		File[] listOfTweetFiles = tweetFolder.listFiles();

		for (File TweetFile : listOfTweetFiles) {
		    if (TweetFile.isFile()) {
				try {
					Scanner TweetFileScan = new Scanner(TweetFile);
					
					// Iterate through each tweet JSON in each file
					while (TweetFileScan.hasNextLine()) {
						// The tweet JSON stores hashtags and urls under a key of
						// "entities" and each is a array under the keys called
						// "hashtags" and "urls".
						JSONObject tweet = (JSONObject)parser.parse(TweetFileScan.nextLine());
						JSONObject entities = (JSONObject)tweet.get("entities");
						JSONArray hashtags = (JSONArray)entities.get("hashtags");
						JSONArray urls = (JSONArray)entities.get("urls");
						
						// Iterate through the hashtags and urls and append each to the
						// entities stringBuilder
						Iterator<JSONObject> hashIter = hashtags.iterator();
						Iterator<JSONObject> urlIter = urls.iterator();
						while(hashIter.hasNext()) {
							JSONObject hashtagJSON = (JSONObject)hashIter.next();
							addEntity((String)hashtagJSON.get("text"));
						}
						while(urlIter.hasNext()) {
							JSONObject urlJSON = (JSONObject)urlIter.next();
							addEntity((String)urlJSON.get("expanded_url"));
						}
					}
					
					//Write unsaved entities to file
					writeFile();
					System.out.println("File: " + TweetFile.getName() + " is extracted.");
					
				} catch (FileNotFoundException | ParseException e) {
					e.printStackTrace();
				} 
		    }
		}
	}

	//--------------------------------------------------------------------------
	// addEntity
	//
	// entity - String consisting of either a hashtag or url
	//
	// This function 
	//--------------------------------------------------------------------------
	public static void addEntity(String entity) {
		++lineLength;
		
		//Limits the amount of elements to only 10 per line
		if(lineLength == 10) {
			entities.append(entity + "\n");
			lineLength = 0;
			
			//Writes to file whenever there are 1000 lines
			++lineCount;
			if(lineCount == 1000) {
				writeFile();
				lineCount = 0;
			}
		}
		else {
			//Add an element separated by a space
			entities.append(entity + " ");
		}
	}
	
	//--------------------------------------------------------------------------
	// writeFile
	//
	// Writes the contents of entities variable to the file designated in the
	// extractedTweetFile variable. Assumes the existance of a folder "Output" 
	// in the project directory.
	//--------------------------------------------------------------------------
	public static void writeFile() {
		try {
		      FileWriter fileWriter = new FileWriter(extractedTweetFile, true);
		      BufferedWriter bufferWriter = new BufferedWriter(fileWriter);
		      bufferWriter.write(entities.toString());
		      bufferWriter.close();
		      
		      // Reset the in-memory string that was written to the file
		      entities.setLength(0);
		      
		      // Create a new file when the size of the file in the next
	    	  // attempt to save may exceed 64MB.
		      if(extractedTweetFile.length() >= 59392000) {
		    	  ++fileCount;
		    	  extractedTweetFile = new File("Output/HashURLFile" + fileCount + ".txt");
		    	  createFile();
		      }
		    } 
		catch (IOException e) {
		      System.out.println("An error occurred.");
		      e.printStackTrace();
		    }
	}
	
	//--------------------------------------------------------------------------
	// createFile
	//
	// This function creates a new file if it does not already exist. The file
	// name is set in "extractedTweetFile" prior to calling this function
	//--------------------------------------------------------------------------
	private static void createFile() {
		try {
			if (extractedTweetFile.createNewFile()) {
		        System.out.println("File created: " + extractedTweetFile.getName());
		      } 
			else {
		        System.out.println("File already exists.");
		      }
			} 
		catch (IOException e) {
	      System.out.println("An error occurred.");
	      e.printStackTrace();
	    }
	}
}
