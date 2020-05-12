package twitterserver.twitterserver;

import org.eclipse.jetty.server.Server;

import twitterserver.twitterserver.SparkFactory;
import twitterserver.twitterserver.WebServer;
import twitterserver.twitterserver.Config;

import org.apache.log4j.Logger;

public class Main 
{	
    public static void main( String[] args ) throws Exception
    {            	
    	SparkFactory.getInstance();
    	if(Config.runServer) {
	    	WebServer webServer = new WebServer();
	    	Server server = webServer.createServer();
	        server.start();
	        Logger.getRootLogger().info("Server online at http://" + Config.host + ":" + Config.port + "/");
	        server.join();
    	}
    }
}
