package TweetCompiler;

import twitter4j.RawStreamListener;
import twitter4j.TwitterException;
import twitter4j.TwitterStream;
import twitter4j.TwitterStreamFactory;
import org.json.simple.JSONObject;

import org.json.simple.JSONArray;
import org.json.simple.parser.ParseException;
import org.json.simple.parser.JSONParser;

import TweetCompiler.TweetFile;
import TweetCompiler.TweetExtractor;

//--------------------------------------------------------------------------
// TweetCompiler Class
//
// This class collects tweets from Twitter using the Twitter Streaming API.
// The collected tweets exclude retweets and replies and must contain at 
// least a hashtag or url. Once 100k tweets are collected, the hashtags and
// urls are extracted from the tweets and saved to the output file.
// This class contains the main function of the program.
//--------------------------------------------------------------------------
public class TweetCompiler {
	// This builds the string in-memory of the tweets
	private static StringBuilder tweets = new StringBuilder("");
	static JSONParser parser = new JSONParser();
	private static int tweetCount = 0;
	private static int totalTweets = 0;

	//--------------------------------------------------------------------------
	// main
	//
	// This function is the entry point of the program.
	//--------------------------------------------------------------------------
	public static void main(String[] args) throws TwitterException {		
		TwitterStream twitterStream = new TwitterStreamFactory().getInstance().addListener(new RawStreamListener() {
            @Override
            // This function samples the raw stream of messages sent across Twitter
            public void onMessage(String rawJSON) {   
            	//This selects for tweets and excludes other messages such as deletes
            	if(rawJSON.startsWith("{\"created_at\"")) {
            		try {
            			JSONObject tweet = (JSONObject)parser.parse(rawJSON);
            		
            			//This exclude tweets that are retweets or replies
						if(tweet.get("retweeted_status") == null && tweet.get("in_reply_to_status_id") == null) {
							
							// The tweet JSON stores hashtags and urls under a key of
							// "entities" and each is a array under the keys called
							// "hashtags" and "urls".
							JSONObject entities = (JSONObject)tweet.get("entities");
							JSONArray hashtags = (JSONArray)entities.get("hashtags");
							//JSONArray urls = (JSONArray)entities.get("urls");
							
							// This selects for tweets that contain either a hashtag or url
							if(!hashtags.isEmpty() && tweet.get("lang").equals("en")) {// || !urls.isEmpty()) {
								
								// Every tweet is a JSON and only one per line
								tweets.append(rawJSON + "\n");
				            	++tweetCount;
				            	
				            	// Reports every 100 saved tweets to periodically 
				            	// update progress while the program is running
				            	if(tweetCount % 100 == 0)
				            		System.out.println(tweetCount);
				            	
				            	// Save tweets every 1000 tweets to reduce the amount of
				            	// file write calls and the amount of memory needed
				            	if(tweetCount == 1000) {
				            		TweetFile.saveTweets(tweets.toString());
				            		// Moves the string position to 0, effectivly clearing
				            		// the tweets variable 
				            		tweets.setLength(0);
				            		tweetCount = 0;
				            		totalTweets += 1000;
				            		System.out.println(totalTweets + " Tweets");
				            		
				            		// The system will run continuously and the tweet jsons will be added
				            		// to hadoop
				            		// This will begin extracting Hashtag and urls from the collected
				            		// tweets when there are 100k tweets then exit the program
				            		//if(totalTweets >= 100000) {
				            		//	System.out.println("100K tweets collected successfully.");
				            		//	TweetExtractor.run();
				            		//	System.exit(0);
				            		//}				            		
				            	}
							}						
						}
					} 
            		catch (ParseException e) {
						e.printStackTrace();
					}	         
            	}
            }

            @Override
            public void onException(Exception ex) {
                ex.printStackTrace();
            }
        }).sample();
	}
}
