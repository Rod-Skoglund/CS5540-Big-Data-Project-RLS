package twitterserver.twitterserver.handler;

import org.apache.log4j.Logger;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import twitterserver.twitterserver.SparkFactory;

@SuppressWarnings("serial")
public class MostRetweetedHandler extends HttpServlet {
	@Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.setContentType("application/json");
		response.setStatus(HttpServletResponse.SC_OK);
		System.out.println("Getting Retweeted Data");
		Logger.getRootLogger().info("Getting Retweeted Data");
		
		PrintWriter out = response.getWriter();
		out.println(SparkFactory.getInstance().getMostRetweeted());
	
		Logger.getRootLogger().info("Finished Retweeted Data");
	}
}
